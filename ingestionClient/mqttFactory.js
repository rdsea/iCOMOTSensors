import mqtt from 'mqtt'
import fs from 'fs'

function createMqttClient(config){
    let client = mqtt.connect(config);
    
    client.on('connect', () => {
        client.subscribe(config.topic);
        console.log(`client ${config.clientId} is now ingesting from ${config.topic}`);
    });
    
    client.on('message', (topic, message) => {
        console.log(message.toString(), config.clientId);
    });
    
    client.on('error', function(err) {
        console.error(`error occured in client ${client.clientId}`);
        console.log(err);
    });

    return client;
}

var mqttClient = {
    createMqttClient,
}

export default mqttClient



