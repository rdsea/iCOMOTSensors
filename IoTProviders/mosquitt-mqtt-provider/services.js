
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
const kube_configuration_file = "conf/kubeoptions.json";

const kube_option = JSON.parse(fs.readFileSync(kube_configuration_file, 'utf8'));
var current_instances = 0;

export function createBroker(config){
  if (current_instances >= kube_option.max_instances) {
      console.log("The number of instances reaches the limit");
      return      new Broker({
        location: 'NONE',
        port:0,
        url:'NONE',
        createdAt: 0,
        brokerId: "NONE"
        });
    }
    else {
    return provisionBroker().then((timestamp) => {
        let broker = new Broker({
            location: 'creating...',
            port:1883,
            url:'pending',
            createdAt: timestamp,
            brokerId: `broker${timestamp}`,
        });
        current_instances=current_instances+1;
        return broker.save();
    });
  }
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
            current_instances=current_instances-1;
        });
       current_instances=current_instances-1;
    })
}

// also updates the external ip by using kubectl
// TODO find a better way to check external ip than parsing stdout !
export function getBrokers(brokerId){
    let query = {};
    if(brokerId) query.brokerId = brokerId;
    let brokers = [];
    return Broker.find(query).then((res) => {
        brokers = res;
        let kubectl = []; // promise executions of kubetcl;
        brokers.forEach((broker) => {
            console.log(broker);
            if (kube_option.minikube_nodeport) {
              kubectl.push(exec(`minikube service --url ${broker.brokerId}`).catch((err) => err));
            }
            else {
              kubectl.push(exec(`kubectl get services ${broker.brokerId} -o json`).catch((err) => err)); // return error obj otherwise other promises won't resolve
          }
        });
        return Promise.all(kubectl);
    }).then((execs) => {
        let externalIps = [];
        execs.forEach((exec) => {
            externalIps.push(extractExternalIpKubectlGetServicesOutput(exec.stdout));
        });

        let saves = []
        brokers.forEach((broker, index) => {
            broker.location = externalIps[index];
            if (kube_option.minikube_nodeport) {
              broker.url=broker.location.replace("http","mqtt");
            }
            else {
            if(broker.location != "pending..."){
                broker.url = `mqtt://${broker.location}:${broker.port}`
            }
          }
            saves.push(broker.save());
        });

    }).then(() => {
        return brokers;
    });
}

export function getLogs(brokerId){
    let logs = {}
    console.log(`kubectl logs -l app=${brokerId}`)
    return exec(`kubectl logs -l app=${brokerId}`).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            logs.logs = `error fetching logs for ${brokerId}`;
        }
        logs.logs = res.stdout;
        return exec(`kubectl get pods -l app=${brokerId} -o json`)
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            logs.status = `error fetching ${brokerId} status`;
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
            logs: logs.logs
        };
    })
}


// TODO try to get rid of this way of obtaining external IP
function extractExternalIpKubectlGetServicesOutput(stdout){
    try{
      if (kube_option.minikube_nodeport) {
        let serviceurl=stdout;
        return serviceurl.trim();
      }
      else {
        let service = JSON.parse(stdout);
        if(service.status.loadBalancer.ingress){
            return service.status.loadBalancer.ingress[0].ip
        }
      }
    }catch(err){
        console.log(err);
        return "creating..."
    }

    return "creating..."

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
