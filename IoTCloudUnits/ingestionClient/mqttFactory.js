import mqtt from 'mqtt'
import fs from 'fs'
import logger from './logger'
import axios from 'axios';

function createMqttClient(config, remoteDataLocation){
    let client = mqtt.connect(config);
    
    client.on('connect', () => {
        for(let i=0;i<config.topics.length;i++){
            client.subscribe(config.topics[i]);
            logger.info(`client ${config.clientId} is now ingesting from ${config.topics[i]}`);
        }
    });
    
    client.on('message', (topic, message) => {
        // TODO integrate cloud data services here
        logger.info(`${message.toString()} received from topic: ${topic} client: ${config.clientId}`);
		let data = message.toString();
		try{
			data = JSON.parse(data);
		}catch(err){
			logger.warn(`${message.toString()} received from ${config.clientId} is not valid JSON!`);
        }
        axios.post(`http://${remoteDataLocation}/insert`, { data }).then(() => {
            logger.info('message successfully saved');
        }).catch((err) => {
            console.log(remoteDataLocation)
            logger.warn('failed to save message due to external data service')
            logger.error(err.message)
        });
    });
    
    client.on('error', function(err) {
        logger.error(`error occurred in client ${client.clientId}`);
        logger.error(err.message);
    });

    return client;
}

var mqttClient = {
    createMqttClient,
}

export default mqttClient



