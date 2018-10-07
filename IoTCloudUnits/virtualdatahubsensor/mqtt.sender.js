#!/usr/bin/env node

var mqtt = require('mqtt');
var mqttClient = null;

module.exports = {
    connect: function (endpoint) {
        mqttClient = mqtt.connect(endpoint);
    },
    publish: function (endpoint, topic, msg) {
      console.log("MQTT_SEND: ",msg);
      if(mqttClient.connected) {
            mqttClient.publish(topic, msg, function (error) {
                if (error == null) {
                    console.log("mqtt client sent msg: " + msg);
                }
            })
        }
      else {
        console.log("MQTT destination is not connected");
      }
    },
    disconnect: function () {
        if(mqttClient != null) {
            mqttClient.end();
        }
    }
}
