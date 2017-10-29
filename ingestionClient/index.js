import mqtt from 'mqtt'
import yaml from 'js-yaml'
import fs from 'fs'

import mqttFactory from './mqttFactory'
import influxPlugin from './dataPlugins/influxPlugin'

let config = null;
try{
    config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
    console.log('configuration accepted');
    console.log(config);
}catch(err){
    console.log(err);
    console.log('no valid configuration received, exiting...');
    process.exit(1);
}

let clients = [];

// instantiate the clients once db connection has been made
// TODO integrate the option to run several db providers (i.e. BigQuery)
influxPlugin.init(config.database).then(() => {
    for(let i=0;i<config.brokers.length;i++){
        clients.push(mqttFactory.createMqttClient(config.brokers[i], influxPlugin));
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


