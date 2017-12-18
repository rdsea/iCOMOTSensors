import child_process from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import template from './sensorDeployTemplate';

const exec = promisify(child_process.exec);
const writeFile = promisify(fs.writeFile);

const sensorConfigTemplate = {
    "server": "104.155.95.53", 
    "username": "xxx", 
    "password": "xxx", 
    "port": 1883, 
    "clientId": "sensor_topic1_0", 
    "topic": "topic1",
    "remoteLogging": false
};

export function createSensorConfigMap(sensor){
    let sensorConfig = {
        ...sensorConfigTemplate,
        server: sensor.broker,
        topic: sensor.topic,
        clientId: sensor.clientId,
    };
    return writeFile(`/tmp/config.json`, JSON.stringify(sensorConfig), 'utf8').then(() => {
        return exec(`kubectl create configmap config-${sensor.clientId} --from-file=/tmp/config.json`);
    }).then((res) => {
        if(res.stderr) throw new Error('error occurred creating sensor config');
        console.log(res.stdout);
        return sensorConfig;
    });
}

export function provisionSensor(sensor){
    let sensorDeploy = JSON.parse(JSON.stringify(template));
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

export function deleteSensor(clientId){
    return exec(`kubectl delete deployment ${clientId}`).then((res) => {
        if(res.stderr) throw new Exception(res.stderr);
        console.log(res.stdout);
        return exec(`kubectl delete configmap config-${clientId}`);
    }).then((res) => {
        if(res.stderr) throw new Exception(res.stderr);
        console.log(res.stdout);
    }).catch((err) => {
        console.log(err);
    });
}