#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var amqpConnection = null;

module.exports = {
    receive:function(endpoint, queue) {
        amqp.connect(endpoint, function(err, conn) {
            conn.createChannel(function(err, ch) {

                ch.assertQueue(queue, {durable: false});
                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
                ch.consume(queue, function(msg) {
                    console.log(" [x] Received %s", msg.content.toString());
                }, {noAck: true});
            });
            amqpConnection = conn;
        });

    },
    subscribe:function (endpoint, queue, callback) {
        // exchange, exchange_type, pattern,
        amqp.connect(endpoint, function(err, conn) {
            conn.on("close", function() {
                amqpConn = null;
            });
            conn.createChannel(function(err, ch) {

                //ch.assertExchange(exchange, exchange_type, {durable: false});

                //ch.assertQueue(queue, {exclusive: false}, function(err, q) {
                ch.checkQueue(queue, function(err, q) {
                    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
                    //ch.bindQueue(q.queue, exchange, pattern);
                    //TODO check noAck
                    ch.consume(q.queue, callback, {noAck: true});
                });
            });
            amqpConnection = conn;
        });
    },
    disconnect:function () {
        if(amqpConnection != null) {
            amqpConnection.close();
        }
    }
}

