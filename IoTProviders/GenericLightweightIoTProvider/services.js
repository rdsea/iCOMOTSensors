
import child_process from 'child_process';
import fs from 'fs';
import os from 'os';
import { promisify } from 'util';
import deployTemplate from './configTemplates/deployTemplate';
import randomstring from 'randomstring';
import { randomBytes } from 'crypto';
import GLIoTFunction from './data/models/gliotfunction';

const exec = child_process.exec;
const execSync = child_process.execSync;
const execFile = child_process.execFile;
const spawn = promisify(child_process.spawn);
const spawnSync = child_process.spawnSync;

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
        let subprocess = gliotmap.get(gliotId);
        return;
        console.log("Local pid is "+subprocess.pid);
        subprocess.kill();
        execSync(`kill -9 ${subprocess.pid}`);
        gliotmap.delete(gliotId);
        //execs.push(exec(`kubectl delete services ${brokerId}`).catch((err) => err));
        //return Promise.all(execs);
    //}).then((execs) => {
    //    execs.forEach((exec) => {
    //        console.log(exec.stdout);
    //        console.log(exec.stderr);
    //    });
  });
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
    let output_script_file = "/tmp/deploy-"+gliotId+".sh";
    return writeFile(output_script_file, gliotDeploy.start_script, 'utf8').then (() => {
        console.log("Execute: "+output_script_file);
        console.log("Call spawn to create new process "+gliotDeploy.start_script);
        let args =[output_script_file];
        console.log("Run /bin/sh " + args);
        return  spawn("/bin/sh",args,{detached:true,shell:false,stdio: 'ignore'});
        //subprocess.on('exit', function(exit_code) {
        //  if (exit_code != 0) {
        //    console.log("The subprocess of "+gliotDeploy.start_script+"has been failed");
        //  }
        //});
        //subprocess.unref();
        //return subprocess;
        //.exec(`/bin/sh /tmp/deploy-${gliotId}.sh`,{shell:false,detached:true});
        //var args=[`/tmp/deploy-${gliotId}.sh`]
        //return exec('/bin/sh',args);
     }).then((subprocess) => {
        if(subprocess.stderr) {
            console.log(subprocess.stderr);
            throw new Error('error occurred provisioning gliot');
        }
        //console.log(subprocess.stdout);
        let gliotfunction = new GLIoTFunction({
            location: os.hostname(),
            createdAt: timestamp,
            local_pid: subprocess.pid,
            gliotId: gliotId,
            status:"RUNNING"
        });
        gliotmap.set(gliotId,subprocess);
        //here we need to save it into the table.
        return gliotfunction;
    });
  }
