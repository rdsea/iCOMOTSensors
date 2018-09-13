#!/usr/bin/env node

var mqtt = require('mqtt');
var mqttClient = null;

module.exports = {
    subscribe:function (endpoint, queue, callback) {
        mqttClient = mqtt.connect(endpoint);
        mqttClient.on('connect', function () {
            mqttClient.subscribe(queue, function() {
                // when a message arrives, do something with it
                mqttClient.on('message', function(topic, message, packet) {
                    callback(message);
                });
            });
        });
      mqttClient.on('close', function () {
        console.log("MQTT is closed");
      });
    },
    disconnect:function () {
        if(mqttClient != null) {
            mqttClient.end();
        }
    }
}
