import mqtt from 'mqtt'
import fs from 'fs'
<<<<<<< HEAD
=======
import logger from './logger'
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32

function createMqttClient(config, dataPlugin){
    let client = mqtt.connect(config);
    
    client.on('connect', () => {
        for(let i=0;i<config.topics.length;i++){
            client.subscribe(config.topics[i]);
<<<<<<< HEAD
            console.log(`client ${config.clientId} is now ingesting from ${config.topics[i]}`);
=======
            logger.info(`client ${config.clientId} is now ingesting from ${config.topics[i]}`);
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32
        }
    });
    
    client.on('message', (topic, message) => {
        // TODO integrate cloud data services here
<<<<<<< HEAD
        console.log(message.toString(),`topic: ${topic}` ,`client: ${config.clientId}`);
=======
        logger.info(`${message.toString()} received from topic: ${topic} client: ${config.clientId}`);
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32
		let data = message.toString();
		try{
			data = JSON.parse(data);
		}catch(err){
<<<<<<< HEAD
			console.log('message received is not JSON');
		}
        dataPlugin.insert(topic, data);
    });
    
    client.on('error', function(err) {
        console.error(`error occured in client ${client.clientId}`);
        console.log(err);
=======
			logger.warning(`${message.toString()} received from ${config.clientId} is not valid JSON!`);
		}
        dataPlugin.insert(topic, data).catch((err) => console.log(err));
    });
    
    client.on('error', function(err) {
        logger.error(`error occurred in client ${client.clientId}`);
        logger.error(err);
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32
    });

    return client;
}

var mqttClient = {
    createMqttClient,
}

export default mqttClient



