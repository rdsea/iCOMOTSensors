const child_process = require("child_process");
const fs = require("fs");
const promisify = require("util").promisify;
const deployTemplate = require("./configTemplates/deployTemplate");
const db = require("./data/db");

const exec = promisify(child_process.exec);
const writeFile = promisify(fs.writeFile);

function createAlarmClient(config){
    let timestamp = (new Date()).getTime();
    let alarmclientId = `alarmclient${timestamp}`
    return _createConfigMap(config, alarmclientId).then(() => {
        return _provisionAlarmClient(alarmclientId)
    }).then(() => {
        config.createdAt =  timestamp;
        config.alarmclientId = alarmclientId;
        return db.insert(config);
    })
}

function getAlarmClient(alarmclientId){
    let query = {
        alarmclientId,
    };

    if(!(alarmclientId)) delete query.alarmclientId;
 
    return db.find(query).then((res) => {
        return res;
    });
}

function deleteAlarmClient(alarmclientId){
    let query = {
        alarmclientId,
    };

    return db.remove(query, {}).then(() => {
        let execs = [];
        console.log('deleting kubectl deployments and config maps')
        execs.push(exec(`kubectl delete deployments ${alarmclientId}`).catch((err) => err));
        execs.push(exec(`kubectl delete configmaps config-${alarmclientId}`).catch((err) => err));
        return Promise.all(execs);
    }).then((execs) => {
        execs.forEach((exec) => {
            console.log(exec.stdout);
            console.log(exec.stderr);
        });
    })
}

function _provisionAlarmClient(alarmClientId){
    let alarmClientDeploy = JSON.parse(JSON.stringify(deployTemplate));
    alarmClientDeploy.metadata.name = alarmClientId;
    alarmClientDeploy.spec.template.metadata.labels.app = alarmClientId;

    alarmClientDeploy.spec.template.spec.volumes.push({
        name: "config",
        configMap: { name: `config-${alarmClientId}`}
    });

    alarmClientDeploy.spec.template.spec.containers[0].volumeMounts.push({
        name: "config",
        mountPath: "/alarmclient/config.yml",
        subPath: "config.yml",
    });

    return writeFile(`/tmp/deploy-${alarmClientId}.json`, JSON.stringify(alarmClientDeploy), 'utf8').then(() => {
        return exec(`kubectl create -f /tmp/deploy-${alarmClientId}.json`);
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred provisioning alarm client');
        }
        console.log(res.stdout);
    })

}

function _createConfigMap(config, alarmClientId){
    return writeFile(`/tmp/config.yml`, JSON.stringify(config), 'utf8').then(() => {
        return exec(`kubectl create configmap config-${alarmClientId} --from-file=/tmp/config.yml`);
    }).then((res) => {
        if(res.stderr) throw new Error('error occurred creating ingestion client config');
        console.log(res.stdout);
        return config;
    });
}

module.exports = {
    createAlarmClient,
    deleteAlarmClient,
    getAlarmClient
}