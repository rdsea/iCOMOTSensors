'use strict';

const express = require('express');
// Constants
const PORT = 8080;
const os = require("os");
const HOST = os.hostname();

// App
const app = express();
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
const csvtojson=require('csvtojson');

var amqp = require('amqplib/callback_api');
var amqpsender = require('./amqp.sender.js');
var amqpreceiver = require('./amqp.receiver.js');

var mqtt = require('mqtt');
var mqttsender = require('./mqtt.sender');
var mqttreceiver = require('./mqtt.receiver');

//by default the sender (sink) will be MQTT.
var isMQTTSender = true;


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

//var connection = amqp.connect('amqp://localhost');
//var mqttclient  = mqtt.connect('mqtt://test.mosquitto.org');
//var exchange_type = 'fanout';
//var pattern = '';

app.use(bodyParser.json()); // for parsing application/json

app.get('/', (req, res) => {
    var title = "<h1>CSV to JSON</h1>";

    var amqptitle = "<h2>amqp</h2>";
    var amqpsub = '<div>POST /amqp/in/subscribe</div>';
    var amqpsubdis = '<div>POST /amqp/in/disconnect</div>';
    var amqppub = '<div>POST /amqp/out/connect</div>';
    var amqppubdis = '<div>POST /amqp/out/disconnect</div>';

    var amqpInfo = amqptitle + amqpsub + amqpsubdis + amqppub + amqppubdis;

    var mqtttitle = "<h2>mqtt</h2>";
    var mqttsub = '<div>POST /mqtt/in/subscribe</div>';
    var mqttsubdis = '<div>POST /mqtt/in/disconnect</div>';
    var mqttpub = '<div>POST /mqtt/out/connect</div>';
    var mqttpubdis = '<div>POST /mqtt/out/disconnect</div>';

    var mqttInfo = mqtttitle + mqttsub + mqttsubdis + mqttpub + mqttpubdis;

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

app.post('/amqp/out/connect', upload.array(), function (req, res, next) {
    //TODO check input
    amqpOUT.endpoint = req.body.endpoint;
    amqpOUT.exchange = req.body.exchange;
    amqpOUT.routing_key = req.body.routing_key;

    amqpsender.connect(amqpOUT.endpoint, amqpOUT.exchange);
    isMQTTSender =false;
    res.send("AMQP: publish messages to \nendpoint: " + amqpOUT.endpoint + "\nexchange: " + amqpOUT.exchange + "\nrouting_key: " + amqpOUT.routing_key + "\n");

});

app.post('/amqp/out/disconnect', (req,res) => {
    amqpsender.disconnect();

    amqpOUT.endpoint = "";
    amqpOUT.exchange = "";
    amqpOUT.routing_key = "";
    isMQTTSender=true;
    res.send("AMQP: stopped publishing messages to \nendpoint: " + amqpOUT.endpoint + "\nexchange: " + amqpOUT.exchange + "\nrouting_key: " + amqpOUT.routing_key + "\n");

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

app.post('/mqtt/out/connect', upload.array(), function (req, res, next) {
    //TODO check input
    mqttOUT.endpoint = req.body.endpoint;
    mqttOUT.topic = req.body.routing_key;

    mqttsender.connect(mqttOUT.endpoint, mqttOUT.topic);
    isMQTTSender=true;
    res.send("MQTT: publish messages to \nendpoint: " + mqttOUT.endpoint + "\ntopic/routing_key: " + mqttOUT.topic + "\n");
});

app.post('/mqtt/out/disconnect', (req,res) => {
    mqttOUT.endpoint = "";
    mqttOUT.topic = "";
    mqttsender.disconnect();
    isMQTTSender=false;
    res.send("stopped publishing messages to \nendpoint: " + mqttOUT.endpoint + "\ntopic/routing_key: " + mqttOUT.topic + "\n");

});


function ampqCallback(msg){
    csv2json(msg.content.toString(), function (reply) {
      if (isMQTTSender) {
        mqttsender.publish(mqttOUT.endpoint, mqttOUT.topic, reply);
      }
      else {
        amqpsender.publish(amqpOUT.endpoint, amqpOUT.exchange, amqpOUT.topic, reply);
      }
    });
}

function mqttCallback(msg){
    csv2json(arrayBufferToString(msg), function (reply) {
        if (isMQTTSender) {
        mqttsender.publish(mqttOUT.endpoint, mqttOUT.topic, reply);
      }
      else {
        amqpsender.publish(amqpOUT.endpoint, amqpOUT.exchange, amqpOUT.topic, reply);
      }
    });
}

function csv2json(msg, sendfunction){
    console.log(" [x] %s", msg);
    var csvStr = msg;
    var jsonArray = [];
    var reply ="";

    csvtojson({noheader:false})
        .fromString(csvStr)
        .on('json',(json)=>{ // this func will be called 3 times
        console.log(json) // => [1,2,3] , [4,5,6]  , [7,8,9]
    jsonArray.push(json);
    })
    .on('done',()=>{
        reply = JSON.stringify(jsonArray);
        sendfunction(reply);
    });
}




app.listen(PORT);
console.log(`Running on http://${HOST}:${PORT}`);

function arrayBufferToString(buffer){
    var arr = new Uint8Array(buffer);
    var str = String.fromCharCode.apply(String, arr);
    if(/[\u0080-\uffff]/.test(str)){
        throw new Error("this string seems to contain (still encoded) multibytes");
    }
    return str;
}
