#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var amqpConn = null;
var channel = null;

var current_endpoint ="";
var current_exchange = "";

module.exports = {
    connect: function (endpoint, exchange) {
        createChannel(endpoint,exchange);
    },
    publish: function (endpoint, exchange, routing_key, msg) {
        if(amqpConn == null || channel == null || current_endpoint !== endpoint || current_exchange !== exchange){
            //TODO close existing channel
            current_endpoint = endpoint;
            current_exchange = exchange;

            connectAndPublish(endpoint, exchange, routing_key, msg);
        }else{
            channel.publish(exchange, routing_key, new Buffer(msg));
            console.log(" [x] Sent %s", msg);
        }
    },
    disconnect: function () {
        if(amqpConn != null) {
            amqpConn.close();
        }
    }
}

function createChannel(endpoint, exchange) {
    amqp.connect(endpoint, function (err, conn) {
        conn.on("close", function() {
            amqpConn = null;
        });
        conn.createChannel(function (err, ch) {
            ch.on("close", function() {
                channel = null;
            });
            ch.checkExchange(exchange);
            channel = ch;
        });
        amqpConn = conn;
    });
}

function connectAndPublish(endpoint, exchange, routing_key, msg) {
    amqp.connect(endpoint, function (err, conn) {
        conn.on("close", function() {
            amqpConn = null;
        });
        conn.createChannel(function (err, ch) {
            ch.on("close", function() {
                channel = null;
            });
            ch.checkExchange(exchange);
            channel = ch;
            channel.publish(exchange, routing_key, new Buffer(msg));
        });
        amqpConn = conn;
    });
}

function stringCheck(s){
    if(s && typeof (s === 'string' || s instanceof String) && s.length>0){
        return true;
    }else{
        return false;
    }
}