const mqtt = require('mqtt');
const logger = require('./src/logger')
const config = require('./config');


let client = mqtt.connect(config.broker);
    
client.on('connect', () => {
    let topic = config.vessel.boat.replace(/ /g,'').toLowerCase()
    client.subscribe(topic);
    logger.info(`now listening to ${topic}`);
});

client.on('message', (topic, message) => {
    logger.info(`${message.toString()} received from topic: ${topic} client: ${config.clientId}`);
    let action = message.toString();
    _doAction(action);
});

client.on('error', function(err) {
    logger.error(`error occurred in client ${client.clientId}`);
    logger.error(err.message);
});

client.on('close', () => {
    logger.warn(`disconnected client no longer ingesting from ${config.topics}`);
})

function _doAction(action){  
    switch(action){
        case "NOTIFY_PRESENCE_TERMINAL_AUTHORITY":
            logger.info("NOTIFY_PRESENCE_TERMINAL_AUTHORITY")
            break;
        case "NOTIFY_PRESENCE_HARBOUR_AUTHORITY":
            logger.info("NOTIFY_PRESENCE_HARBOUR_AUTHORITY")
            break;
        case "COMMENCE_EVACUATION":
            logger.info("COMMENCE_EVACUATION")
            break;
        case "BROADCAST_ASSIST_REQUEST":
            logger.info("BROADCAST_ASSIST_REQUEST")
            break;
        case "REQUEST_NEW_TERMINAL":
            logger.info("REQUEST_NEW_TERMINAL")
            break;
    }
}