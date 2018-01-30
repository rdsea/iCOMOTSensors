import Sensor from './data/models/sensor';

import child_process from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import deployTemplate from './configTemplates/sensorDeployTemplate';
import configTemplate from './configTemplates/sensorConfigTemplate';
import randomstring from 'randomstring';
import { randomBytes } from 'crypto';
import * as sensorTypes from './data/models/sensorTypes';

const exec = promisify(child_process.exec);
const writeFile = promisify(fs.writeFile);


export function createParamSensor(config){
    return createSensor(config, sensorTypes.PARAM);
}

export function createAlertSensor(config){
    return createSensor(config, sensorTypes.ALERT);
}

export function getParamSensors(){
    return findSensors(sensorTypes.PARAM);
}

export function getAlertSensors(){
    return findSensors(sensorTypes.ALERT);
}


function createSensor(config, type){
    let sensorId = `sensor${(new Date()).getTime()}`;
    config.clientId = sensorId;
    return createSensorConfigMap(config).then((sensorConfig) => {
        return provisionSensor(sensorConfig);
    }).then((sensor) => {
        let dbSensor = new Sensor({
            type: config.type,
            clientId: sensorId,
            broker: config.broker,
            topic: config.topic,
            createdAt: Math.floor((new Date()).getTime()/1000),
            type: type,
        });
        return dbSensor.save();
    });
}

function findSensors(type){
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

function createSensorConfigMap(config){
    let sensorConfig = {
        ...configTemplate,
        server: config.broker,
        topic: config.topic,
        clientId: config.clientId,
    };
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
        mountPath: "/sensor/config",
    });

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