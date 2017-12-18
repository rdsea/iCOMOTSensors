const util = require('util');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);
const writeFile = util.promisify(fs.writeFile);
var template = {
    "apiVersion": "extensions/v1beta1",
    "kind": "Deployment",
    "metadata": {
      "name": "sensor"
    },
    "spec": {
      "replicas": 1,
      "template": {
        "metadata": {
          "labels": {
            "app": "sensor",
            "role": "test",
            "tier": "bts"
          }
        },
        "spec": {
          "volumes":[],
          "containers": [
            {
              "name": "sensor",
              "image": "rdsea/sensor",
              "command":["java"],
              "args": ["-jar", "sdsensor-0.0.1-SNAPSHOT-jar-with-dependencies.jar", "config/config.json", "data.csv", "test"],
              "volumeMounts":[],
              "resources": {
                "requests": {
                  "cpu": "100m",
                  "memory": "100Mi"
                }
              }
            }
          ]
        }
      }
    }
  }



const sensorConfigTemplate = {
    "server": "104.155.95.53", 
    "username": "xxx", 
    "password": "xxx", 
    "port": 1883, 
    "clientId": "sensor_topic1_0", 
    "topic": "topic1",
    "remoteLogging": false
};

function createSensorConfigMap(sensor){
    let sensorConfig = {
        ...sensorConfigTemplate,
        server: sensor.broker,
        topic: sensor.topic,
        clientId: sensor.clientId,
    };
    writeFile(`/tmp/config.json`, JSON.stringify(sensorConfig), 'utf8').then(() => {
        return exec(`kubectl create configmap config-${sensor.clientId} --from-file=/tmp/config.json`);
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred creating sensor config');
        }
    })
}

function provisionSensor(sensor){
    let sensorDeploy = { ...template };
    sensorDeploy.metadata.name = sensor.clientId,
    sensorDeploy.spec.template.spec.volumes.push({
        name: "config",
        configMap: { name: `config-${sensor.clientId}`}
    });

    sensorDeploy.spec.template.spec.containers[0].volumeMounts.push({
        name: "config",
        mountPath: "/sensor/config",
    });

    writeFile(`/tmp/deploy-${sensor.clientId}.json`, JSON.stringify(sensorDeploy), 'utf8').then(() => {
        return exec(`kubectl create -f /tmp/deploy-${sensor.clientId}.json`);
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred provisioning sensor');
        }
        console.log(res.stdout);
    })
}

let testSensor = {
    broker: '104.155.95.53',
    topic: 'test',
    clientId: 'testsensor',
};

createSensorConfigMap(testSensor);
provisionSensor(testSensor);