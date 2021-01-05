'use strict';

const express = require('express');
// Constants
//TODO: move this into a configuration file
const PORT = 8080;
const os = require("os");
const HOST = os.hostname();

// App
const app = express();
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

var amqp = require('amqplib/callback_api');
var amqpreceiver = require('./amqp.receiver.js');

var mqtt = require('mqtt');
var mqttreceiver = require('./mqtt.receiver');

var coapsender =require('./coapsender');


//Variables
//'{"queue":"hello", "endpoint":"amqp://localhost"}'
var amqpIN = {};
amqpIN.queue = "hello";
amqpIN.endpoint = 'amqp://localhost';


//Variables
//'{"queue":"hello", "endpoint":"amqp://localhost"}'
var mqttIN = {};
mqttIN.topic = "hello";
mqttIN.endpoint = 'mqtt://localhost';

//'{"endpoint": "amqp://localhost", "exchange": "testexchange","routing_key": ""}'
var coapOUT = {};
coapOUT.endpoint = 'coap://localhost';
coapOUT.multicast=false;

app.use(bodyParser.json()); // for parsing application/json

app.get('/', (req, res) => {
    var title = "<h1>PubSubToCoAP</h1>";

    var amqptitle = "<h2>amqp</h2>";
    var amqpsub = '<div>POST /amqp/in/subscribe</div>';
    var amqpsubdis = '<div>POST /amqp/in/disconnect</div>';

    var amqpInfo = amqptitle + amqpsub + amqpsubdis;

    var mqtttitle = "<h2>mqtt</h2>";
    var mqttsub = '<div>POST /mqtt/in/subscribe</div>';
    var mqttsubdis = '<div>POST /mqtt/in/disconnect</div>';


    var mqttInfo = mqtttitle + mqttsub + mqttsubdis;

    res.send(title + amqpInfo + mqttInfo);

    //TODO: return api
});

app.post('/amqp/in/subscribe', upload.array(), function (req, res, next) {
    //TODO check input
    amqpIN.endpoint = req.body.endpoint;
    amqpIN.queue = req.body.queue;

    amqpreceiver.subscribe(amqpIN.endpoint, amqpIN.queue, ampqCallback);

    res.send("AMQP: subscribed to \nendpoint: " + amqpIN.endpoint + "\nqueue: " + amqpIN.queue  + "\n");
});


app.post('/amqp/in/disconnect', (req,res) => {
    res.send("AMQP: closed subscribtion of \nendpoint: " + amqpIN.endpoint + "\nqueue: " + amqpIN.queue + "\n");
    amqpIN.endpoint = "";
    amqpIN.queue = "";
    amqpreceiver.disconnect();
});


app.post('/mqtt/in/subscribe', upload.array(), function (req, res, next) {
    //TODO check input
    mqttIN.endpoint = req.body.endpoint;
    mqttIN.topic = req.body.topic;

    mqttreceiver.subscribe(mqttIN.endpoint, mqttIN.topic, mqttCallback);

    res.send("MQTT: subscribed to \nendpoint: " + mqttIN.endpoint + "\ntopic: " + mqttIN.topic  + "\n");
});


app.post('/mqtt/in/disconnect', (req,res) => {
    res.send("MQTT: closed subscribtion of \nendpoint: " + mqttIN.endpoint + "\ntopic: " + mqttIN.topic + "\n");
    mqttreceiver.disconnect();
    mqttIN.endpoint = "";
    mqttIN.topic = "";
});

app.post('/coap/out/direct', upload.array(), function (req, res, next) {
    //TODO check input
    coapOUT.endpoint = req.body.endpoint;
    res.send("coAP: subscribed to \nendpoint: " + coapOUT.endpoint  + "\n");
});
app.post('/coap/out/multicast', upload.array(), function (req, res, next) {
    //TODO check input
    coapOUT.endpoint = req.body.endpoint;
    coapOUT.multicast=true;
    res.send("coAP: subscribed to \nendpoint: " + coapOUT.endpoint  + "\n");
});

function ampqCallback(msg){
    messageTransformation(msg.content, function (reply) {
      coapsender.publish(coapOUT.endpoint, coapOUT.multicast, amqpIN.topic,reply);
    });
    console.log("End of callback");
}

function mqttCallback(msg){
    messageTransformation(msg, function (reply) {
      coapsender.publish(coapOUT.endpoint, coapOUT.multicast, mqttIN.topic,reply);
    });
    console.log("End of callback");
}

//to be user-defined.
function messageTransformation(msg, sendfunction){
    console.log(" [x] %s", msg);
    sendfunction(msg);
}


app.listen(PORT);
console.log(`Running on http://${HOST}:${PORT}`);
