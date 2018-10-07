#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var amqpConnection = null;

module.exports = {
    receive:function(endpoint, exchange, callback) {
        amqp.connect(endpoint, function(err, conn) {
            conn.createChannel(function(err, conn) {
                conn.assertExchange(exchange, 'fanout', {durable: false});
                conn.assertQueue('', {exclusive: true}, function(err, q) {
                  console.log("Virtual sensor waiting for messages in %s ", q.queue);
                  conn.bindQueue(q.queue, exchange, '');
                  conn.consume(q.queue, callback, {noAck: true});
                });
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
