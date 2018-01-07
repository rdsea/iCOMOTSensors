import Testrig from './data/models/testrig';

import child_process from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import deployTemplate from './configTemplates/deployTemplate';
import serviceTemplate from './configTemplates/serviceTemplate';
import randomstring from 'randomstring';
import { randomBytes } from 'crypto';
import testrig from './data/models/testrig';

const exec = promisify(child_process.exec);
const writeFile = promisify(fs.writeFile);

export function createTestRig(config){
    return provisionTestrig().then((timestamp) => {
        let testrig = new Testrig({
            location: 'creating...',
            createdAt: timestamp,
            sliceId: config.sliceId,
            testrigId: `testrig${timestamp}`,
        });
        return testrig.save();
    });
}

export function deleteTestrig(testrigId){
    let query = {
        testrigId,
    };
    return Testrig.findOneAndRemove(testrigId).then(() => {
        let execs = [];
        execs.push(exec(`kubectl delete deployments ${testrigId}`).catch((err) => err));
        execs.push(exec(`kubectl delete services ${testrigId}`).catch((err) => err));
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
export function getTestrigs(sliceId){
    let query = {
        sliceId,
    };
    let testrigs = [];
    return Testrig.find(query).then((rigs) => {
        testrigs = rigs;
        let kubectl = []; // promise executions of kubetcl;
        testrigs.forEach((testrig) => {
            kubectl.push(exec(`kubectl get services ${testrig.testrigId}`).catch((err) => err)); // return error obj otherwise other promises won't resolve
        });
        return Promise.all(kubectl);
    }).then((execs) => {
        let externalIps = [];
        execs.forEach((exec) => {
            externalIps.push(extractExternalIpKubectlGetServicesOutput(exec.stdout));
        });
        
        let saves = []
        testrigs.forEach((testrig, index) => {
            console.log(externalIps);
            testrig.location = externalIps[index];
            saves.push(testrig.save());
        });
    }).then((rigs) => {
        return testrigs;
    });
}

// TODO try to get rid of this way of obtaining external IP
function extractExternalIpKubectlGetServicesOutput(stdout){
    let lines = stdout.split(/\r?\n/);
    let tokens = lines[1].split(/\s+/);
    return tokens[3];
}

// provisions testrig and returns timestamp it was provisioned
function provisionTestrig(){
    let timestamp = (new Date()).getTime();
    let testrigId = `testrig${timestamp}`
    let testrigDeploy = JSON.parse(JSON.stringify(deployTemplate));
    testrigDeploy.metadata.name = testrigId;
    testrigDeploy.spec.template.metadata.labels.app = testrigId;

    return writeFile(`/tmp/deploy-${testrigId}.json`, JSON.stringify(testrigDeploy), 'utf8').then(() => {
        return exec(`kubectl create -f /tmp/deploy-${testrigId}.json`);
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred provisioning sensor');
        }
        console.log(res.stdout);
        return exposeTestrig(timestamp);
    }).then(() => {
        return timestamp;
    })
}


// exposes the testrig publicly though google container engine service
function exposeTestrig(timestamp){
    let testrigId = `testrig${timestamp}`;
    let testrigService = serviceTemplate;
    testrigService.metadata.labels.app = testrigId;
    testrigService.metadata.name = testrigId;
    testrigService.spec.selector.app = testrigId;
    return writeFile(`/tmp/service-${testrigId}.json`, JSON.stringify(testrigService), 'utf8').then(() => {
        return exec(`kubectl create -f /tmp/service-${testrigId}.json`);
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred exposing sensor');
        }
        console.log(res.stdout);
        return timestamp;
    });
}