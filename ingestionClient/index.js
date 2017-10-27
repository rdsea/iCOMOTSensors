import mqtt from 'mqtt'
import yaml from 'js-yaml'
import fs from 'fs'
import mqttFactory from './mqttFactory'

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
for(let i=0;i<config.brokers.length;i++){
    clients.push(mqttFactory.createMqttClient(config.brokers[i]));
}

// gracefully handle interruption and exit
function clean(){
    for(let i=0;i<clients.length;i++){
        clients[i].end();
    }
    process.exit();
}

process.on('SIGINT', () => {
    console.log('terminating client...');
    clean();
})

// gracefully handle exit
process.on('exit', () => {
    console.log('terminating client...');
    clean();
})


