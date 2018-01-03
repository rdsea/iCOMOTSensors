import mqtt from 'mqtt'
import yaml from 'js-yaml'
import fs from 'fs'
<<<<<<< HEAD
=======
import logger from './logger'
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32

import mqttFactory from './mqttFactory'

// load config
let config = null;
try{
<<<<<<< HEAD
    config = yaml.safeLoad(fs.readFileSync(process.env.CONFIG, 'utf8'));
    console.log('configuration accepted');
}catch(err){
    console.log(err);
    console.log('no valid configuration received, exiting...');
=======
    config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
    logger.info('valid configuration accepted');
}catch(err){
    logger.error(err);
    logger.error('no valid configuration received, exiting...');
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32
    process.exit(1);
}

// load data plugin
var dataPlugin = null;
try{
    // es6 default export is just a named export with default
    dataPlugin = require(`./dataPlugins/${config.data}/dataPlugin`).default;    
}catch(err){
<<<<<<< HEAD
    console.log('error loading data plugin');
    console.log(err)
=======
    logger.error('error lodaing data plugin');
    loogger.error(err);
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32
}

let clients = [];

<<<<<<< HEAD
=======
if(config.test){
    try{
        dataPlugin.setTestMode();
        console.log("test mode activated");
    }catch(e){
        console.log(e);
    }
}

>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32
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
<<<<<<< HEAD
    console.log('terminating client...');
=======
    logger.info('terminating client...');
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32
    clean();
})

// gracefully handle exit
process.on('uncaughtException', (err) => {
<<<<<<< HEAD
    console.log(err);
    console.log('terminating client...');
=======
    logger.error(err);
    logger.error('terminating client due to exception...');
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32
    clean();
})


