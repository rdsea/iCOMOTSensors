
import child_process from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import deployTemplate from './configTemplates/deployTemplate';
import serviceTemplate from './configTemplates/serviceTemplate';
import randomstring from 'randomstring';
import { randomBytes } from 'crypto';
import FirewallController from './data/models/firewallcontroller';

const exec = promisify(child_process.exec);
const writeFile = promisify(fs.writeFile);

export function createFirewallController(config){
    return provisionFirewallController().then((timestamp) => {
        let firewallcontroller = new FirewallController({
            systemId: systemId,
            createdAt: timestamp,
            firewallcontrollerId: `firewallcontroller${timestamp}`,
        });
        return firewallcontroller.save();
    });
}

export function deleteFirewallController(firewallcontrollerId){
    let query = {
        firewallcontrollerId,
    };
    return FirewallController.findOneAndRemove(firewallcontrollerId).then(() => {
        let execs = [];
        execs.push(exec(`kubectl delete deployments ${firewallcontrollerId}`).catch((err) => err));
        execs.push(exec(`kubectl delete services ${firewallcontrollerId}`).catch((err) => err));
        return Promise.all(execs);
    }).then((execs) => {
        execs.forEach((exec) => {
            console.log(exec.stdout);
            console.log(exec.stderr);
        });
    })
}

// also updates the external ip by using kubectl
// TODO find a better way to check external ip than parsing stdout !
export function getFirewallControllers(firewallcontrollerId){
    let query = {};
    if(firewallcontrollerId) query.firewallcontrollerId = firewallcontrollerId;
    let firewallcontrollers = [];
    return FirewallController.find(query).then((res) => {
        firewallcontrollers = res;
        let kubectl = []; // promise executions of kubetcl;
        firewallcontrollers.forEach((firewallcontroller) => {
            console.log(firewallcontroller);
            kubectl.push(exec(`kubectl get services ${firewallcontroller.firewallcontrollerId}`).catch((err) => err)); // return error obj otherwise other promises won't resolve
        });
        return Promise.all(kubectl);
    }).then((execs) => {
        let externalIps = [];
        execs.forEach((exec) => {
            externalIps.push(extractExternalIpKubectlGetServicesOutput(exec.stdout));
        });

        let saves = []
        firewallcontrollers.forEach((firewallcontroller, index) => {
            console.log(externalIps);
            firewallcontroller.location = externalIps[index];
            saves.push(firewallcontroller.save());
        });
    }).then(() => {
        return firewallcontrollers;
    });
}

// TODO try to get rid of this way of obtaining external IP
function extractExternalIpKubectlGetServicesOutput(stdout){
    try{
        let lines = stdout.split(/\r?\n/);
        let tokens = lines[1].split(/\s+/);
        return tokens[3];
    }catch(err){
        return 'N/A';
    }

}

// provisions testrig and returns timestamp it was provisioned
function provisionFirewallController(){
    let timestamp = (new Date()).getTime();
    let firewallcontrollerId = `firewallcontroller${timestamp}`
    let firewallcontrollerDeploy = JSON.parse(JSON.stringify(deployTemplate));
    firewallcontrollerDeploy.metadata.name = firewallcontrollerId;
    firewallcontrollerDeploy.spec.template.metadata.labels.app = firewallcontrollerId;

    return writeFile(`/tmp/deploy-${firewallcontrollerId}.json`, JSON.stringify(firewallcontrollerDeploy), 'utf8').then(() => {
        return exec(`kubectl create -f /tmp/deploy-${firewallcontrollerId}.json`);
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred provisioning broker');
        }
        console.log(res.stdout);
        return exposeFirewallController(timestamp);
    }).then(() => {
        return timestamp;
    })
}


// exposes the testrig publicly though google container engine service
function exposeFirewallController(timestamp){
    let firewallcontrollerId = `firewallcontroller${timestamp}`;
    let firewallcontrollerService = serviceTemplate;
    firewallcontrollerService.metadata.labels.app = firewallcontrollerId;
    firewallcontrollerService.metadata.name = firewallcontrollerId;
    firewallcontrollerService.spec.selector.app = firewallcontrollerId;
    return writeFile(`/tmp/service-${firewallcontrollerId}.json`, JSON.stringify(firewallcontrollerService), 'utf8').then(() => {
        return exec(`kubectl create -f /tmp/service-${firewallcontrollerId}.json`);
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred exposing firewall controller');
        }
        console.log(res.stdout);
        return timestamp;
    });
}
