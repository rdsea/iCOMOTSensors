import Sensor from './data/models/sensor';

import child_process from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import deployTemplate from './configTemplates/sensorDeployTemplate';
import randomstring from 'randomstring';
import { randomBytes } from 'crypto';
import * as sensorTypes from './data/models/sensorTypes';
import * as configTemplates from './configTemplates/sensorConfigTemplate';

const exec = promisify(child_process.exec);
const writeFile = promisify(fs.writeFile);


export function getSampleConfigs(){
    let configs = {};
    Object.keys(sensorTypes).forEach((sensorType) => {
        let configTemplate = configTemplates[sensorType];
        configs[sensorType] = { 
            url:`/sensor/bts/${sensorType}`,
            sampleConfiguration: {
                uri: configTemplate.uri,
                ...configTemplate.protocolOptions,
            },
            communication:configTemplate.protocol,
            format: configTemplate.format,
            measurement: configTemplate.measurement,
            unit: configTemplate.unit,
        }
    });
    return configs;
}

export function provision(config, type){
    return createSensor(config, type);
}

function createSensor(config, type){
    let sensorId = `sensor${(new Date()).getTime()}`;
    config.clientId = sensorId;
    return createSensorConfigMap(config, type).then((sensorConfig) => {
        return provisionSensor(sensorConfig);
    }).then((sensor) => {
        let dbSensor = new Sensor({
            type: config.type,
            clientId: sensorId,
            uri: config.uri,
            topic: config.topic,
            createdAt: Math.floor((new Date()).getTime()/1000),
            type: type,
        });
        return dbSensor.save();
    });
}

export function findSensors(type){
    let query = {
        type,
    }
    return Sensor.find(query).catch((err) => {
        console.log(err);
        return null;
    });
}

export function deleteSensor(sensorId){
    return exec(`kubectl delete configmap config-${sensorId}`).then((res) => {
        console.log(res.stdout);
        console.log(res.stderr);
        return exec(`kubectl delete deployment ${sensorId}`)
    }).then((res) => {
        console.log(res.stdout) ;
        console.log(res.stdin);
        return Sensor.remove({ clientId: sensorId });
    })
}

function createSensorConfigMap(config, type){
    let sensorConfig = {
        ...configTemplates[type],
        uri: config.uri,
        protocolOptions:{ topic: config.topic },
        clientId: config.clientId,
    };
    console.log(JSON.stringify(sensorConfig));
    
    return writeFile(`/tmp/config.json`, JSON.stringify(sensorConfig), 'utf8').then(() => {
        return exec(`kubectl create configmap config-${sensorConfig.clientId} --from-file=/tmp/config.json`);
    }).then((res) => {
        if(res.stderr) throw new Error('error occurred creating sensor config');
        console.log(res.stdout);
        return sensorConfig;
    });
}

function provisionSensor(sensor){
    let sensorDeploy = JSON.parse(JSON.stringify(deployTemplate));
    sensorDeploy.metadata.name = sensor.clientId,
    sensorDeploy.spec.template.spec.volumes.push({
        name: "config",
        configMap: { name: `config-${sensor.clientId}`}
    });

    sensorDeploy.spec.template.spec.containers[0].volumeMounts.push({
        name: "config",
        mountPath: "/sensor/config.json",
        subPath: "config.json"
    });

    sensorDeploy.spec.template.spec.containers[0].image = 'rdsea/'+sensor.name;
    console.log(JSON.stringify(sensorDeploy));
    return writeFile(`/tmp/deploy-${sensor.clientId}.json`, JSON.stringify(sensorDeploy), 'utf8').then(() => {
        return exec(`kubectl create -f /tmp/deploy-${sensor.clientId}.json`);
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred provisioning sensor');
        }
        console.log(res.stdout);
        return sensor;
    });
}