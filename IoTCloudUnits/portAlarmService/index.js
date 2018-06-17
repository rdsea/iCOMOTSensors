const mqtt = require('mqtt');
const logger = require('./src/logger')
const config = require('./config');

const handleAlarm = require('./src/pcsService');

let client = mqtt.connect(config.alarmBroker);

//connect to the alarm broker
client.on('connect', () => {
    for(let i=0;i<config.alarmBroker.topics.length;i++){
        client.subscribe(config.alarmBroker.topics[i]);
        logger.info(`now listening to alarms`);
    }
});

//assume that the alarm is in JSON
client.on('message', (topic, message) => {
    logger.info(`${message.toString()} received from topic: ${topic} client: ${config.clientId}`);
		let data = message.toString();
		try{
			data = JSON.parse(data);
		}catch(err){
			logger.warn(`${message.toString()} received from ${config.clientId} is not valid JSON!`);
        }
        handleAlarm(data);
});

client.on('error', function(err) {
    logger.error(`error occurred in client ${client.clientId}`);
    logger.error(err.message);
});

client.on('close', () => {
    logger.warn(`disconnected client no longer ingesting from ${config.topics}`);
})
