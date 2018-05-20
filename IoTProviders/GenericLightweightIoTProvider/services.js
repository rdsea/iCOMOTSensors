
import child_process from 'child_process';
import fs from 'fs';
import os from 'os';
import { promisify } from 'util';
import deployTemplate from './configTemplates/deployTemplate';
import randomstring from 'randomstring';
import { randomBytes } from 'crypto';
import GLIoTFunction from './data/models/gliotfunction';

const exec = promisify(child_process.exec);
const execFile = child_process.execFile;
const spawn = child_process.spawn;
const writeFile = promisify(fs.writeFile);
const HashMap = require('hashmap');
var gliotmap = new HashMap();

export function createGLIoTFunction(config){
  let gliotFunctions = JSON.parse(JSON.stringify(deployTemplate));
  let functions=gliotFunctions.functions;
  let function_name =config.functionname;
  console.log("Start function " + function_name);
  let gliotDeploy =null;
  for (var i=0; i < functions.length; i++) {
    if (functions[i].functionname==function_name) {
      gliotDeploy = functions[i]
      break;
    }
  }
  if (gliotDeploy == null) {
    let timestamp = (new Date()).getTime();
    let gliotfunction = new GLIoTFunction({
        location: os.hostname(),
        createdAt: timestamp,
        local_pid: -1,
        gliotId: "NONE",
        status:"ERROR"

    });
    return gliotfunction.save();
  }
  console.log(gliotDeploy);
  return provisionGLIoTFunction(gliotDeploy).then((gliotfunction) => {
        return gliotfunction.save();
    });
}

export function deleteGLIoTFunction(gliotId){
    let query = {
        gliotId,
    };
    return GLIoTFunction.findOneAndRemove(gliotId).then(() => {
        let execs = [];
        local_pid = gliotmap.get(gliotId);
        console.log("Local pid is "+local_pid);
        execs.push(exec(`kill -9 ${local_pid}`).catch((err) => err));
        gliotmap.delete(gliotId);
        //execs.push(exec(`kubectl delete services ${brokerId}`).catch((err) => err));
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
export function getGLIoTFunctions(gliotId){
    let query = {};
    if(gliotId) query.gliotId = gliotId;
    let gliotfunctions = [];
    return GLIoTFunction.find(query).then((res) => {
        gliotfunctions = res;
        return gliotfunctions;
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

// provisions the function and returns timestamp it was provisioned
function provisionGLIoTFunction(gliotDeploy){
    let timestamp = (new Date()).getTime();
    let gliotId = `gliot${timestamp}`;
    /* More work is needed to fix the type of scripts and
      also the way to execute scripts.
    */
    // this is only for direct script. if a script is in a file, then
    // we can just check if the file is available or not.
    return writeFile(`/tmp/deploy-${gliotId}.sh`, gliotDeploy.start_script, 'utf8').then(() => {
        console.log("Execute: "+`/tmp/deploy-${gliotId}.sh`)
        return exec(`/bin/sh /tmp/deploy-${gliotId}.sh`,{shell:true});
        //var args=[`/tmp/deploy-${gliotId}.sh`]
        //return exec('/bin/sh',args);
    }).then((res) => {
        if(res.stderr) {
            console.log(res.stderr);
            throw new Error('error occurred provisioning gliot');
        }
        console.log(res.stdout);
        let gliotfunction = new GLIoTFunction({
            location: os.hostname(),
            createdAt: timestamp,
            local_pid: res.pid,
            gliotId: gliotId,
            status:"RUNNING"
        });
        gliotmap.set(gliotId,res.pid);
        //here we need to save it into the table.
        return gliotfunction;
    })
  }
