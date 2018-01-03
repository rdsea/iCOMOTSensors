import Sensor from './data/models/sensor';
import SensorInstance from './data/models/sensorInstance';

import child_process from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import deployTemplate from './configTemplates/sensorDeployTemplate';
import configTemplate from './configTemplates/sensorConfigTemplate';
import randomstring from 'randomstring';
import { randomBytes } from 'crypto';

const exec = promisify(child_process.exec);
const writeFile = promisify(fs.writeFile);

export function createSensorInstance(config){
    return findExistingSensor(config).then((sensor) => {
        if(sensor){
            return sensor;
        }else{
            return createSensor(config);
        }
    }).then((sensor) => {
        let sensorInstance = new SensorInstance({
            type: config.type,
            broker: config.broker,
            topic: config.topic,
            sliceId: config.sliceId,
            sensorId: sensor._id,
            createdAt: Math.floor((new Date()).getTime()/1000),
        });
        return sensorInstance.save();
    });
}

function createSensor(config){
    return createSensorConfigMap(config).then((sensorConfig) => {
        return provisionSensor(sensorConfig);
    }).then((sensor) => {
        let dbSensor = new Sensor({
            type: config.type,
            clientId: config.clientId,
            broker: config.broker,
            topic: config.topic,
            createdAt: Math.floor((new Date()).getTime()/1000),
        });
        return dbSensor.save();
    });
}

function findExistingSensor(config){
    let query = {
        type: config.type,
        broker: config.broker,
        topic: config.topic,
    }
    return Sensor.findOne(query).catch((err) => {
        console.log(err);
        return null;
    });
}

function createSensorConfigMap(config){
    let clientId = `${randomstring.generate(7).toLowerCase()}`;
    let sensorConfig = {
        ...configTemplate,
        server: config.broker,
        topic: config.topic,
        clientId: clientId,
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