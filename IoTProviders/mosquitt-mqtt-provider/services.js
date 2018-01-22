
import child_process from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import deployTemplate from './configTemplates/deployTemplate';
import serviceTemplate from './configTemplates/serviceTemplate';
import randomstring from 'randomstring';
import { randomBytes } from 'crypto';
import Broker from './data/models/broker';

const exec = promisify(child_process.exec);
const writeFile = promisify(fs.writeFile);

export function createBroker(config){
    return provisionBroker().then((timestamp) => {
        let broker = new Broker({
            location: 'creating...',
            createdAt: timestamp,
            sliceId: config.sliceId,
            brokerId: `broker${timestamp}`,
        });
        return broker.save();
    });
}

export function deleteBroker(brokerId){
    let query = {
        brokerId,
    };
    return Broker.findOneAndRemove(brokerId).then(() => {
        let execs = [];
        execs.push(exec(`kubectl delete deployments ${brokerId}`).catch((err) => err));
        execs.push(exec(`kubectl delete services ${brokerId}`).catch((err) => err));
        return Promise.all(execs);
    }).then((execs) => {
        execs.forEach((exec) => {
            console.log(exec.stdout);
            console.log(exec.stderr);
        });
    })
}

// returns all the test rigs for a sliceId
// also updates the external ip by using kubectl 
// TODO find a better way to check external ip than parsing stdout !
export function getBrokers(sliceId){
    let query = {
        sliceId,
    };
    let brokers = [];
    return Broker.find(query).then((res) => {
        brokers = res;
        let kubectl = []; // promise executions of kubetcl;
        brokers.forEach((broker) => {
            kubectl.push(exec(`kubectl get services ${broker.brokerId}`).catch((err) => err)); // return error obj otherwise other promises won't resolve
        });
        return Promise.all(kubectl);
    }).then((execs) => {
        let externalIps = [];
        execs.forEach((exec) => {
            externalIps.push(extractExternalIpKubectlGetServicesOutput(exec.stdout));
        });
        
        let saves = []
        brokers.forEach((broker, index) => {
            console.log(externalIps);
            broker.location = externalIps[index];
            saves.push(broker.save());
        });
    }).then(() => {
        return brokers;
    });
}

// TODO try to get rid of this way of obtaining external IP
function extractExternalIpKubectlGetServicesOutput(stdout){
    let lines = stdout.split(/\r?\n/);
    let tokens = lines[1].split(/\s+/);
    return tokens[3];
}

// provisions testrig and returns timestamp it was provisioned
function provisionBroker(){
    let timestamp = (new Date()).getTime();
    let brokerId = `broker${timestamp}`
    let brokerDeploy = JSON.parse(JSON.stringify(deployTemplate));
    brokerDeploy.metadata.name = brokerId;
    brokerDeploy.spec.template.metadata.labels.app = brokerId;

    return writeFile(`/tmp/deploy-${brokerId}.json`, JSON.stringify(brokerDeploy), 'utf8').then(() => {
        return exec(`kubectl create -f /tmp/deploy-${brokerId}.json`);
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred provisioning broker');
        }
        console.log(res.stdout);
        return exposeBroker(timestamp);
    }).then(() => {
        return timestamp;
    })
}


// exposes the testrig publicly though google container engine service
function exposeBroker(timestamp){
    let brokerId = `broker${timestamp}`;
    let brokerService = serviceTemplate;
    brokerService.metadata.labels.app = brokerId;
    brokerService.metadata.name = brokerId;
    brokerService.spec.selector.app = brokerId;
    return writeFile(`/tmp/service-${brokerId}.json`, JSON.stringify(brokerService), 'utf8').then(() => {
        return exec(`kubectl create -f /tmp/service-${brokerId}.json`);
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred exposing broker');
        }
        console.log(res.stdout);
        return timestamp;
    });
}