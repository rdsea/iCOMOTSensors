import mqtt from 'mqtt'
import fs from 'fs'

function createMqttClient(config, dataPlugin){
    let client = mqtt.connect(config);
    
    client.on('connect', () => {
        for(let i=0;i<config.topics.length;i++){
            client.subscribe(config.topics[i]);
            console.log(`client ${config.clientId} is now ingesting from ${config.topics[i]}`);
        }
    });
    
    client.on('message', (topic, message) => {
        // TODO integrate cloud data services here
        console.log(message.toString(),`topic: ${topic}` ,`client: ${config.clientId}`);
		let data = message.toString();
		try{
			data = JSON.parse(data);
		}catch(err){
			console.log('message received is not JSON');
		}
        dataPlugin.insert(topic, data);
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



