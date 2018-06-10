
import child_process from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import deployTemplate from './configTemplates/deployTemplate';
import randomstring from 'randomstring';
import { randomBytes } from 'crypto';
import * as db from './data/db';

const exec = promisify(child_process.exec);
const writeFile = promisify(fs.writeFile);

export function createIngestionClient(config){
    let timestamp = (new Date()).getTime();
    let ingestionClientId = `ingestionclient${timestamp}`;
    return createConfigMap(config, ingestionClientId).then(() => {
        return createBigQueryConfigMap(config, ingestionClientId);
    }).then(() => {
        return provisionIngestionClient(config, ingestionClientId)
    }).then(() => {
        return db.insert({
            createdAt: timestamp,
            ingestionClientId: ingestionClientId,
            ...config,
        });
    })

}

export function deleteIngestionClient(ingestionClientId){
    let query = {
        ingestionClientId,
    };
    return db.remove(query, {}).then(() => {
        let execs = [];
        console.log('deleting kubectl deployments and config maps')
        execs.push(exec(`kubectl delete deployments ${ingestionClientId}`).catch((err) => err));
        execs.push(exec(`kubectl delete configmaps config-${ingestionClientId}`).catch((err) => err));
        execs.push(exec(`kubectl delete configmaps config-bigquery-${ingestionClientId}`).catch((err) => err));
        return Promise.all(execs);
    }).then((execs) => {
        execs.forEach((exec) => {
            console.log(exec.stdout);
            console.log(exec.stderr);
        });
    })
}

export function getIngestionClient(ingestionClientId){
    let query = {
        ingestionClientId,
    };

    if(!(ingestionClientId)) delete query.ingestionClientId;
 
    return db.find(query).then((res) => {
        return res;
    });
}

function provisionIngestionClient(config, ingestionClientId){
    let timestamp = (new Date()).getTime();
    let ingestionDeploy = JSON.parse(JSON.stringify(deployTemplate));
    ingestionDeploy.metadata.name = ingestionClientId;
    ingestionDeploy.spec.template.metadata.labels.app = ingestionClientId;

    ingestionDeploy.metadata.name = ingestionClientId,
    ingestionDeploy.spec.template.spec.volumes.push({
        name: "config",
        configMap: { name: `config-${ingestionClientId}`}
    });

    ingestionDeploy.spec.template.spec.containers[0].volumeMounts.push({
        name: "config",
        mountPath: "/ingestionClient/config.yml",
        subPath: "config.yml",
    });

    ingestionDeploy.spec.template.spec.volumes.push({
        name: "config-bigquery",
        configMap: { name: `config-bigquery-${ingestionClientId}`}
    });

    ingestionDeploy.spec.template.spec.containers[0].volumeMounts.push({
        name: "config-bigquery",
        mountPath: "/ingestionClient/dataPlugins/bigQuery/config.yml",
        subPath: "config.yml",
    });

    ingestionDeploy.spec.template.spec.volumes.push({
        name: "keyfile",
        secret: { secretName: `bigquery-key`}
    });

    ingestionDeploy.spec.template.spec.containers[0].volumeMounts.push({
        name: "keyfile",
        mountPath: "/ingestionClient/dataPlugins/bigQuery/keyfile.json",
        subPath: "keyfile.json",
    });

    return writeFile(`/tmp/deploy-${ingestionClientId}.json`, JSON.stringify(ingestionDeploy), 'utf8').then(() => {
        return exec(`kubectl create -f /tmp/deploy-${ingestionClientId}.json`);
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred provisioning ingestion client');
        }
        console.log(res.stdout);
    })
}

function createConfigMap(config, ingestionClientId){
    return writeFile(`/tmp/config.yml`, JSON.stringify(config), 'utf8').then(() => {
        return exec(`kubectl create configmap config-${ingestionClientId} --from-file=/tmp/config.yml`);
    }).then((res) => {
        if(res.stderr) throw new Error('error occurred creating ingestion client config');
        console.log(res.stdout);
        return config;
    });
}

function createBigQueryConfigMap(config, ingestionClientId){
    return writeFile(`/tmp/config.bigquery.yml`, JSON.stringify(config.bigQuery), 'utf8').then(() => {
        return exec(`kubectl create configmap config-bigquery-${ingestionClientId} --from-file=config.yml=/tmp/config.bigquery.yml`);
    }).then((res) => {
        if(res.stderr) throw new Error('error occurred creating ingestion client bigquery config');
        console.log(res.stdout);
        return config;
    });
}

export function createGoogleServiceAccountSecret(ingestionClientId){
    return exec(`kubectl create secret generic bigquery-key --from-file=keyfile.json=keyfile.json`).then((res) => {
        if(res.stderr) throw new Error('error occurred creating ingestion client bigquery secret key');
        console.log(res.stdout);
        return config;
    });
}

export function getLogs(ingestionClientId){
    let logs = {}
    console.log(`kubectl logs -l app=${ingestionClientId} --since=15m `)
    return exec(`kubectl logs -l app=${ingestionClientId} --since=15m `).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            logs.logs = `error fetching logs for ${ingestionClientId}`;
        }
        logs.logs = res.stdout;
        return exec(`kubectl get pods -l app=${ingestionClientId} -o json`)        
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            logs.status = `error fetching ${ingestionClientId} status`;
        }
        
        let raw = JSON.parse(res.stdout);
        try{
            logs.status = {
                deployment: "kubernetes.io",
                cpu: raw.items[0].spec.containers[0].resources.requests.cpu,
                memory: raw.items[0].spec.containers[0].resources.requests.memory,
                statuses:raw.items[0].status.containerStatuses.phase,
                startTime:  raw.items[0].status.containerStatuses.startTime
            }
        }catch(err){
            console.err(err);
            logs.status = "could not retrieve resource status"
        }
        
        return {
            status: logs.status,
            logs: {
                output: logs.logs,
                since: "15 minutes"
            }
        };
    })
}