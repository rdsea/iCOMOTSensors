
import child_process from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import deployTemplate from './configTemplates/deployTemplate';
import serviceTemplate from './configTemplates/serviceTemplate';
const config_package=require('config');
var kubeOptions=config_package.get("kubeoptions");
const isIp = require('is-ip');
const isUrl = require('is-url');
// from './configTemplates/kubeOptions';
import randomstring from 'randomstring';
import { randomBytes } from 'crypto';
import DataTransformer from './data/models/datatransformer';

const exec = promisify(child_process.exec);
const writeFile = promisify(fs.writeFile);
//simple counter
var current_instances = 0;
export function createDataTransformer(config){
    let tenantId =config.tenantId;
    let name =config.name;
    let description=config.description;
    if (current_instances >= kubeOptions.max_instances) {
      console.log("The number of instances reaches the limit");
      return      new DataTransformer({
                  tenantId:"NONE",
                  description:"The number of instances reaches the limit",
                  name:"NONE",
                  location: 'ERROR',
                  createdAt: 0,
                  datatransformerId: "NONE",
                  port: 0,
                  url: "ERROR"
              });
    }
    return provisionDataTransformer().then((timestamp) => {

        let datatransformer = new DataTransformer({
            tenantId:tenantId,
            description:description,
            name:name,
            location: 'creating...',
            createdAt: timestamp,
            datatransformerId: `datatransformer${timestamp}`,
            port: 1880,
            url: "pending..."
        });
        current_instances=current_instances+1;
        return datatransformer.save();
    });
}

export function deleteDataTransformer(datatransformerId){
    let query = {
        'datatransformerId':datatransformerId
    };
    return DataTransformer.findOneAndDelete(query).then(() => {
        let execs = [];
        execs.push(exec(`kubectl delete deployments ${datatransformerId}`).catch((err) => err));
        execs.push(exec(`kubectl delete services ${datatransformerId}`).catch((err) => err));
        current_instances=current_instances-1;
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
export function getDataTransformers(datatransformerId){
    let query = {};
    if(datatransformerId)
      query.datatransformerId = datatransformerId;

    let datatransformers = [];
    return DataTransformer.find(query).then((res) => {
        datatransformers = res;
        let kubectl = []; // promise executions of kubetcl;
        datatransformers.forEach((datatransformer) => {
          if (!isUrl(datatransformer.url))
            _updateDataTransformerInfo(datatransformer);

  /*
          if (process.env.MINIKUBE_NODEPORT) {
            kubectl.push(exec(`minikube service --url ${datatransformer.datatransformerId}`).catch((err) => err));
          }
          else {
            kubectl.push(exec(`kubectl get services ${datatransformer.datatransformerId} -o json`).catch((err) => err)); // return error obj otherwise other promises won't resolve
          }
        });
        return Promise.all(kubectl);
    }).then((execs) => {
        let externalIps = [];
        //either ip or url in case of minukube nodeport
        execs.forEach((exec) => {
            externalIps.push(extractExternalIpKubectlGetServicesOutput(exec.stdout));
        });

        let saves = []
        datatransformers.forEach((datatransformer, index) => {
            datatransformer.location = externalIps[index];
            if (process.env.MINIKUBE_NODEPORT) {
              datatransformer.url=datatransformer.location;
            }
            else {
              if(datatransformer.location != "pending..."){
                datatransformer.url = `http://${datatransformer.location}:${datatransformer.port}`
              }
            }
            saves.push(datatransformer.save());
            */
        });

    }).then(() => {
        return datatransformers;
    });

}
//TODO: when we dont need to update, just take info from database.
 function _updateDataTransformerInfo(datatransformer){

        let kubectl = []; // promise executions of kubetcl;
        if (process.env.MINIKUBE_NODEPORT) {
            kubectl.push(exec(`minikube service --url ${datatransformer.datatransformerId}`).catch((err) => err));
        }
        else {
            kubectl.push(exec(`kubectl get services ${datatransformer.datatransformerId} -o json`).catch((err) => err)); // return error obj otherwise other promises won't resolve
          }
        Promise.all(kubectl).then((execs) => {
          let externalIps = [];
          //either ip or url in case of minukube nodeport
          externalIps.push(extractExternalIpKubectlGetServicesOutput(execs[0].stdout));
          //if somehow we cannot get the information, do nothing
          if (externalIps[0]==null)
            return datatransformer;

          datatransformer.location = externalIps[0];
          if (process.env.MINIKUBE_NODEPORT) {
              datatransformer.url=datatransformer.location;
          }
          else {

              if(isIp(datatransformer.location)){
                datatransformer.url = `http://${datatransformer.location}:${datatransformer.port}`
              }
            }
        return datatransformer.save();
    });
}

// TODO try to get rid of this way of obtaining external IP
function extractExternalIpKubectlGetServicesOutput(stdout){
    if (stdout ==null)
      return ;
    try{
        if (process.env.MINIKUBE_NODEPORT) {
          let serviceurl=stdout;
          return serviceurl.trim();
      }
      else {
          console.log(stdout);
          let service = JSON.parse(stdout);
          if(service.status.loadBalancer.ingress){
            return service.status.loadBalancer.ingress[0].ip
          }
          else
            return;
     }
    }
    catch(err){
        console.log(err);
        return
    }

    return "creating..."

}

// provisions testrig and returns timestamp it was provisioned
function provisionDataTransformer(){
    let timestamp = (new Date()).getTime();
    let datatransformerId = `datatransformer${timestamp}`
    let datatransformerDeploy = JSON.parse(JSON.stringify(deployTemplate, null, 2));
    datatransformerDeploy.metadata.name = datatransformerId;
    datatransformerDeploy.spec.template.metadata.labels.app = datatransformerId;

    return writeFile(`/tmp/deploy-${datatransformerId}.json`, JSON.stringify(datatransformerDeploy), 'utf8').then(() => {
        return exec(`kubectl create -f /tmp/deploy-${datatransformerId}.json`);
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred provisioning datatransformer');
        }
        console.log(res.stdout);
        return exposeDataTransformer(timestamp);
    }).then(() => {
        return timestamp;
    })
}


// exposes the testrig publicly though google container engine service
function exposeDataTransformer(timestamp){
    let datatransformerId = `datatransformer${timestamp}`;
    let datatransformerService = serviceTemplate;
    datatransformerService.metadata.labels.app = datatransformerId;
    datatransformerService.metadata.name = datatransformerId;
    datatransformerService.spec.selector.app = datatransformerId;
    return writeFile(`/tmp/service-${datatransformerId}.json`, JSON.stringify(datatransformerService), 'utf8').then(() => {
        return exec(`kubectl create -f /tmp/service-${datatransformerId}.json`);
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred exposing data transformer');
        }
        console.log(res.stdout);
        return timestamp;
    });
}
