import mqtt from 'mqtt'
import yaml from 'js-yaml'
import fs from 'fs'
import logger from './logger'

import mqttFactory from './mqttFactory'

// load config
let config = null;
try{
    config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
    logger.info('valid configuration accepted');
}catch(err){
    logger.error(err);
    logger.error('no valid configuration received, exiting...');
    process.exit(1);
}

let clients = [];

if(config.test){
    try{
        dataPlugin.setTestMode();
        console.log("test mode activated");
    }catch(e){
        console.log(e);
    }
}

// instantiate the clients once db connection has been made
for(let i=0;i<config.brokers.length;i++){
    clients.push(mqttFactory.createMqttClient(config.brokers[i], config.remoteDataLocation));
}    

logger.info('ingest client listening for connections...')

// gracefully handle interruption and exit
function clean(){
    for(let i=0;i<clients.length;i++){
        clients[i].end();
    }
    process.exit();
}

// WARNING this might not work on windows as signals are a unix thig
process.on('SIGINT', () => {
    logger.info('terminating client...');
    clean();
})

// gracefully handle exit
process.on('uncaughtException', (err) => {
    logger.error(err.message);
    logger.error('terminating client due to exception...');
    clean();
})


