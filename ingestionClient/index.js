import mqtt from 'mqtt'
import yaml from 'js-yaml'
import fs from 'fs'

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

let client = mqtt.connect(config);

client.on('connect', () => {
    client.subscribe(config.topic);
    console.log(`client ${config.clientId} is now ingesting from ${config.topic}`);
});

client.on('message', (topic, message) => {
    // the message is a bugger
    console.log(message.toString());
});

client.on('error', function(err) {
    console.log(err);
    process.exit(0);
});

// gracefully handle interruption
process.on('SIGINT', () => {
    console.log('terminating client...');
    client.end();
})

// gracefully handle exit
process.on('exit', () => {
    console.log('terminating client...');
    client.end();
})


