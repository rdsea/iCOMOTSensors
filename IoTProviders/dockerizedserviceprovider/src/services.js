
//const Docker = require('node-docker-api');
//const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const child_process = require("child_process");
//const fs = require("fs");
const fs = require('fs-extra');
const promisify = require("util").promisify;
const db = require("./data/db");
const exec = promisify(child_process.exec);
const writeFile = promisify(fs.outputFile);
const dockerizedserviceprovider=require("config");
var provider_config =dockerizedserviceprovider.get("dockerizedserviceprovider");
//var cmdrun=require('node-cmd');
//var treekill = require('tree-kill');
let currentPort = 8300;

function createService(config){
    let timestamp = Date.now();
    //some issues with name we need to deal with.
    let raw_serviceId = `service${config.image}${timestamp}`;
    config.serviceId = raw_serviceId.replace(/[^a-zA-Z0-9_.-]/gi, '');
    return _runDocker(config).then(() => {
        return db.insert(config);
    })
}

function deleteService(serviceId){
    return _stopDocker(serviceId).then(() => {
        return db.remove({serviceId});
    });
}

function getService(serviceId){
    return db.findOne({serviceId});
}

function getAllServices(){
    let query ={
      providerid:provider_config.PROVIDER_ID
    };
    return db.find(query);
}

function getAllImages(){
  //TODO we can check if a pre-defined list of images is available
    console.log("Get all images");
    return _listExistingDockerImages();
}



function _runDocker(config){
    config['providerid']=provider_config.PROVIDER_ID;
    let cmd = `docker run -d  --name ${config.serviceId}`;
    config.environment.forEach((env) => {
        cmd += ` -e ${env.name}='${env.value}'`;
    });
    if (config.ports) {
      let hostPorts = _generatePorts(config.ports.length);
      let exposedPortTuples=[]
      config.ports.forEach((port, index) => {
          cmd += ` -p ${hostPorts[index]}:${port}`
          let portMap = {
            "source":port,
            "exposed":hostPorts[index]
          }
          exposedPortTuples.push(portMap)
        });
        config['exposedPorts']=exposedPortTuples;
      }
    let writeFilePromises = [];
    if (config.files) {

      //created file is put into the mount directory
      config.files.forEach((file) => {
        writeFilePromises.push(writeFile(`/tmp/${config.serviceId}/${file.name}`, file.body));
        cmd += ` -v /tmp/${config.serviceId}:${file.path}`;
      });
    }
    if (config.args) {
      cmd += ` ${config.args}`;
    }
    cmd += ` ${config.image}`;
    console.log("Running: ",cmd);
    return Promise.all(writeFilePromises).then(() => {
        return exec(cmd);
        //return cmdrun.run(cmd);
    }).then((r) => {
        if(r.stderr) {
            console.log(r.stderr);
            throw new Error('error occurred starting docker service');
        }
        console.log(r.stdout);
  });
}

function _stopDocker(serviceId){
    return exec(`docker stop ${serviceId}`).then((r) => {
        if(r.stderr) {
            console.log(r.stderr);
            throw new Error('error occurred stopping docker service');
        }
        console.log(r.stdout);
        return exec(`docker rm ${serviceId}`);
    }).then((r) => {
        if(r.stderr) {
            console.log(r.stderr);
            throw new Error('error occurred removing docker service');
        }
        console.log(r.stdout);
    });
}

function _generatePorts(portNb){
    let ports = [];
    for(let i=0;i<portNb;i++){
        ports.push(currentPort++);
    }
    return ports;
}

function _listExistingDockerImages() {

    return exec(`docker images --format "{{.Repository}},{{.Tag}},{{.CreatedAt}},{{.Size}}"`).then((r) => {
        //console.log(r.stdout);
        let jsonresult=[]
        return csvtojson({noheader:true,headers: ['Image','Tag','CreatedAt','Size']})
            .fromString(r.stdout)
            .subscribe((data)=>{
                //console.log(json)
                jsonresult.push(data);
              })
            .on('done',()=>{
              let reply = JSON.stringify(jsonresult);
              console.log("The service found ",reply)
              return reply;
              });

        })
        .catch((err) => {
        //maywe cannot find or not possible to find
          console.log(err);
          let jsonresult=[]
          return JSON.stringify(jsonresult);
        });

  }

module.exports = {
    createService,
    deleteService,
    getAllServices,
    getService,
    getAllImages

}
