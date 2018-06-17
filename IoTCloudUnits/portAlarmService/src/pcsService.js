const axios = require('axios');
const mqtt = require('mqtt');
const logger = require('./logger');
const config = require("../config");

let client = mqtt.connect(config.vesselBroker);

actions = {
    NOTIFY_PRESENCE_TERMINAL_AUTHORITY: "NOTIFY_PRESENCE_TERMINAL_AUTHORITY",
    NOTIFY_PRESENCE_HARBOUR_AUTHORITY: "NOTIFY_PRESENCE_HARBOUR_AUTHORITY",
    COMMENCE_EVACUATION: "COMMENCE_EVACUATION",
    BROADCAST_ASSIST_REQUEST: "BROADCAST_ASSIST_REQUEST",
    REQUEST_NEW_TERMINAL: "REQUEST_NEW_TERMINAL",
}

//TODO: add similar handles for trucks.

function alarmAction(alarm){
    logger.info(`received alarm ${alarm.alarm_type}`);
    logger.info(`requesting all vessels in ${alarm.terminal}`);

    return axios(`${config.pcs}/vessels/${alarm.terminal}`).then((vessels) => {
        logger.info(`${vessels.length} vessels found in ${alarm.terminal}`);
        vessels.forEach((vessel) => {
            // match alarm types and severity to boat status
            switch(alarm.alarm_type){
                case "FIRE":
                    _handleFire(alarm, vessel);
                    break;
                case "POWER":
                    _handlePower(alarm, vessel);
                    break;
                case "CHEMICAL":
                    _handleChemical(alarm, vessel);
                    break;
                case "TRAFFIC":
                    _handleTraffic(alarm, vessel);
                    break;
            }
        });
    });
}

function _handleFire(alarm, vessel){
    let topic = vessel.boat.replace(/ /g,'').toLowerCase()
    switch(alarm.alarm_severity){
        case "NOTICE":
            client.publish(topic, actions.NOTIFY_PRESENCE_TERMINAL_AUTHORITY);
            break;
        case "WARNING":
            client.publish(topic, actions.NOTIFY_PRESENCE_TERMINAL_AUTHORITY);
            client.publish(topic, actions.NOTIFY_PRESENCE_HARBOUR_AUTHORITY);
            client.publish(topic, actions.BROADCAST_ASSIST_REQUEST);
            break;
        case "CRIICAL":
            client.publish(topic, actions.NOTIFY_PRESENCE_TERMINAL_AUTHORITY);
            client.publish(topic, actions.NOTIFY_PRESENCE_HARBOUR_AUTHORITY);
            client.publish(topic, actions.COMMENCE_EVACUATION);
            break;
    }
}

function _handlePower(alarm, vessel){
    let topic = vessel.boat.replace(/ /g,'').toLowerCase()
    switch(alarm.alarm_severity){
        case "NOTICE":
            client.publish(topic, actions.NOTIFY_PRESENCE_TERMINAL_AUTHORITY);
            break;
        case "WARNING":
            client.publish(topic, actions.NOTIFY_PRESENCE_TERMINAL_AUTHORITY);
            break;
        case "CRIICAL":
            client.publish(topic, actions.NOTIFY_PRESENCE_TERMINAL_AUTHORITY);

            break;
    }
}

function _handleChemical(alarm, vessel){
    let topic = vessel.boat.replace(/ /g,'').toLowerCase()
    switch(alarm.alarm_severity){
        case "NOTICE":
            client.publish(topic, actions.NOTIFY_PRESENCE_TERMINAL_AUTHORITY);
            client.publish(topic, actions.NOTIFY_PRESENCE_HARBOUR_AUTHORITY);
            client.publish(topic, actions.REQUEST_NEW_TERMINAL);
            break;
        case "WARNING":
            client.publish(topic, actions.NOTIFY_PRESENCE_TERMINAL_AUTHORITY);
            client.publish(topic, actions.NOTIFY_PRESENCE_HARBOUR_AUTHORITY);
            client.publish(topic, actions.BROADCAST_ASSIST_REQUEST);
            break;
        case "CRIICAL":
            client.publish(topic, actions.NOTIFY_PRESENCE_TERMINAL_AUTHORITY);
            client.publish(topic, actions.NOTIFY_PRESENCE_HARBOUR_AUTHORITY);
            client.publish(topic, actions.COMMENCE_EVACUATION);
            break;
    }
}

function _handleTraffic(alarm, vessel){
    let topic = vessel.boat.replace(/ /g,'').toLowerCase()
    switch(alarm.alarm_severity){
        case "NOTICE":
            client.publish(topic, actions.NOTIFY_PRESENCE_HARBOUR_AUTHORITY);
            break;
        case "WARNING":
            client.publish(topic, actions.NOTIFY_PRESENCE_HARBOUR_AUTHORITY);
            break;
        case "CRIICAL":
            client.publish(topic, actions.NOTIFY_PRESENCE_HARBOUR_AUTHORITY);
            client.publish(topic, actions.REQUEST_NEW_TERMINAL);
            break;
    }
}
module.exports = alarmAction;
