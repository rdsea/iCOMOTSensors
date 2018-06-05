const child_process = require("child_process");
const fs = require("fs");
const promisify = require("util").promisify;
const deployTemplate = require("./configTemplates/deployTemplate");
const db = require("./data/db");

const exec = promisify(child_process.exec);
const writeFile = promisify(fs.writeFile);

function createVessel(config){
    let boatId = config.vessel.boat.replace(/\s/g,'').toLowerCase();
    return _createConfigMap(config, boatId).then(() => {
        return _provisionVessel(boatId)
    }).then(() => {
        config.createdAt =  (new Date()).getTime();
        config.boatId = boatId;
        return db.insert(config);
    })
}

function getVessel(boatId){
    let query = {
        boatId,
    };

    if(!(boatId)) delete query.boatId;
 
    return db.find(query).then((res) => {
        return res;
    });
}

function deleteVessel(boatId){
    let query = {
        boatId,
    };

    return db.remove(query, {}).then(() => {
        let execs = [];
        console.log('deleting kubectl deployments and config maps')
        execs.push(exec(`kubectl delete deployments ${boatId}`).catch((err) => err));
        execs.push(exec(`kubectl delete configmaps config-${boatId}`).catch((err) => err));
        return Promise.all(execs);
    }).then((execs) => {
        execs.forEach((exec) => {
            console.log(exec.stdout);
            console.log(exec.stderr);
        });
    })
}

function _provisionVessel(boatId){
    let vesselDeploy = JSON.parse(JSON.stringify(deployTemplate));
    vesselDeploy.metadata.name = boatId;
    vesselDeploy.spec.template.metadata.labels.app = boatId;

    vesselDeploy.spec.template.spec.volumes.push({
        name: "config",
        configMap: { name: `config-${boatId}`}
    });

    vesselDeploy.spec.template.spec.containers[0].volumeMounts.push({
        name: "config",
        mountPath: "/vessel/config.yml",
        subPath: "config.yml",
    });

    return writeFile(`/tmp/deploy-${boatId}.json`, JSON.stringify(vesselDeploy), 'utf8').then(() => {
        return exec(`kubectl create -f /tmp/deploy-${boatId}.json`);
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred provisioning vessel');
        }
        console.log(res.stdout);
    })

}

function _createConfigMap(config, boatId){
    return writeFile(`/tmp/config.yml`, JSON.stringify(config), 'utf8').then(() => {
        return exec(`kubectl create configmap config-${boatId} --from-file=/tmp/config.yml`);
    }).then((res) => {
        if(res.stderr) throw new Error('error occurred creating ingestion client config');
        console.log(res.stdout);
        return config;
    });
}

module.exports = {
    createVessel,
    deleteVessel,
    getVessel
}