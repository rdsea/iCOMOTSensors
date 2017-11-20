import mqtt from 'mqtt'
import yaml from 'js-yaml'
import fs from 'fs'

import mqttFactory from './mqttFactory'

// load config
let config = null;
try{
    config = yaml.safeLoad(fs.readFileSync('config.yml'));
    console.log('configuration accepted');
}catch(err){
    console.log(err);
    console.log('no valid configuration received, exiting...');
    process.exit(1);
}

// load data plugin
var dataPlugin = null;
try{
    // es6 default export is just a named export with default
    dataPlugin = require(`./dataPlugins/${config.data}/dataPlugin`).default;    
}catch(err){
    console.log('error loading data plugin');
    console.log(err)
}

let clients = [];

// instantiate the clients once db connection has been made
dataPlugin.init().then(() => {
    for(let i=0;i<config.brokers.length;i++){
        clients.push(mqttFactory.createMqttClient(config.brokers[i], dataPlugin));
    }    
});

// gracefully handle interruption and exit
function clean(){
    for(let i=0;i<clients.length;i++){
        clients[i].end();
    }
    process.exit();
}

// WARNING this might not work on windows as signals are a unix thig
process.on('SIGINT', () => {
    console.log('terminating client...');
    clean();
})

// gracefully handle exit
process.on('uncaughtException', (err) => {
    console.log(err);
    console.log('terminating client...');
    clean();
})


