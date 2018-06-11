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

logger.info(`loading ${config.data} data plugin`)
let dataPlugin = require(`./dataPlugins/${config.data}/dataPlugin`).default;

dataPlugin.init().then(() => {
    config.brokers.forEach((broker) => {
        broker.remoteDataLocation = config.remoteDataLocation
        clients.push(mqttFactory.createMqttClient(broker, dataPlugin.insert));
    })
})
  

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


