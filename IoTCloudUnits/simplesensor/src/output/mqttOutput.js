import mqtt from 'mqtt';
import logger from '../logger';

let client = null;
let mqttOptions = null;

export default function output(payload, uri, options){
    if(client === null){
        logger.info(`attempting to connect to mqtt broker at ${uri}`);
        client = mqtt.connect(uri);
        mqttOptions = options;
        
        return new Promise((resolve, reject) => {
            client.on('connect', () => {
                logger.info('mqtt client connected to broker');
                publish(uri, payload);
                resolve();
            });
        });        
    }

    return new Promise((resolve, reject) => {
        publish(uri, payload);
        resolve();
    });
}

function publish(uri, payload){
    logger.info(payload);
    client.publish(mqttOptions.topic, payload);
    logger.info(`payload successfully sent to ${uri} on topic ${mqttOptions.topic} `)
}

