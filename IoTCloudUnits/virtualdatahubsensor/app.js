'use strict';

var virtualdatahubsensor=require('config');
var config=virtualdatahubsensor.get('virtualdatahubsensor');
var amqp = require('amqplib/callback_api');
var amqpsender = require('./amqp.sender.js');
var amqpreceiver = require('./amqp.receiver.js');

var mqtt = require('mqtt');
var mqttsender = require('./mqtt.sender');
var mqttreceiver = require('./mqtt.receiver');

//by default the sender (sink) will be undefined =0.
const UNDEFINED_SINK_MODE=0;
const MQTT_SINK_MODE=1;
const AMQP_SINK_MODE=2
var SINK_MODE = UNDEFINED_SINK_MODE;


//Variables
//'{"queue":"hello", "endpoint":"amqp://localhost"}'
var amqpIN = {};
amqpIN.queue = "hello";
amqpIN.endpoint = 'amqp://localhost';

//'{"endpoint": "amqp://localhost", "exchange": "testexchange","routing_key": ""}'
var amqpOUT = {};
amqpOUT.endpoint = 'amqp://localhost';
amqpOUT.exchange = "testexchange";
amqpOUT.routing_key = '';


//Variables
//'{"queue":"hello", "endpoint":"amqp://localhost"}'
var mqttIN = {};
mqttIN.topic = "hello";
mqttIN.endpoint = 'mqtt://localhost';

//'{"endpoint": "amqp://localhost", "exchange": "testexchange","routing_key": ""}'
var mqttOUT = {};
mqttOUT.endpoint = 'mqtt://localhost';
mqttOUT.topic = 'testexchange';

if (config.in.protocol =="amqp") {
    //TODO check input
    amqpIN.endpoint = config.in.endpoint;
    amqpIN.exchange = config.in.exchange;
    amqpreceiver.receive(amqpIN.endpoint, amqpIN.exchange, ampqCallback);
    console.log("AMQP: subscribed to \nendpoint: " + amqpIN.endpoint + "\nqueue: " + amqpIN.exchange  + "\n");
}

if (config.out.protocol =="amqp") {
    amqpOUT.endpoint = config.out.endpoint;
    amqpOUT.exchange = config.out.exchange;
    amqpOUT.routing_key = config.out.routing_key;

    amqpsender.connect(amqpOUT.endpoint, amqpOUT.exchange);
    SINK_MODE =AMQP_SINK_MODE;
    console.log("AMQP: publish messages to \nendpoint: " + amqpOUT.endpoint + "\nexchange: " + amqpOUT.exchange + "\nrouting_key: " + amqpOUT.routing_key + "\n");
}

if (config.in.protocol=="mqtt") {
    mqttIN.endpoint = config.in.endpoint;
    mqttIN.topic = config.in.topic;
    mqttreceiver.subscribe(mqttIN.endpoint, mqttIN.topic, mqttCallback);
    console.log("MQTT: subscribed to \nendpoint: " + mqttIN.endpoint + "\ntopic: " + mqttIN.topic  + "\n");
}

if (config.out.protocol =="mqtt") {
    mqttOUT.endpoint = config.out.endpoint;
    mqttOUT.topic = config.out.topic;

    mqttsender.connect(mqttOUT.endpoint, mqttOUT.topic);
    SINK_MODE=MQTT_SINK_MODE;
    console.log("MQTT: publish messages to \nendpoint: " + mqttOUT.endpoint + "\ntopic/routing_key: " + mqttOUT.topic + "\n");
}

function ampqCallback(msg){
    var out_msg = msg.content.toString();
    console.log(" [SEND] %s", out_msg);
      if (SINK_MODE==MQTT_SINK_MODE) {
        mqttsender.publish(mqttOUT.endpoint, mqttOUT.topic, out_msg);
      }
      else if (SINK_MODE==AMQP_SINK_MODE){
        amqpsender.publish(amqpOUT.endpoint, amqpOUT.exchange, amqpOUT.routing_key, out_msg);
      }
      else {
        console.log("Unknown sink mode");
      }
}

function mqttCallback(msg){
    var out_msg = arrayBufferToString(msg);
    console.log(" [SEND] %s", out_msg);
      if (SINK_MODE==MQTT_SINK_MODE) {
        mqttsender.publish(mqttOUT.endpoint, mqttOUT.topic, out_msg);
      }
      else if (SINK_MODE==AMQP_SINK_MODE){
        amqpsender.publish(amqpOUT.endpoint, amqpOUT.exchange, amqpOUT.routing_key, out_msg);
      }
      else {
        console.log("Unknown sink mode");
      }
}

function arrayBufferToString(buffer){
    var arr = new Uint8Array(buffer);
    var str = String.fromCharCode.apply(String, arr);
    if(/[\u0080-\uffff]/.test(str)){
        throw new Error("this string seems to contain (still encoded) multibytes");
    }
    return str;
}
