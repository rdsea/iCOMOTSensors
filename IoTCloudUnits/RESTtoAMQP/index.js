const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config");
const amqp = require('amqplib');
const chai = require('chai');
chai.use(require('chai-url'));

let connection = null;
let channel = null;
chai.expect(config.amqp_uri).to.have.protocol('amqp');
console.log(`connecting to amqp broker at ${config.amqp_uri}`);
amqp.connect(config.amqp_uri).then((conn) => {
    console.log(`successfully connected to ${config.amqp_uri}`);
    connection = conn;
    console.log('creating new channel');
    return connection.createChannel();
}).then((ch) => {
    channel = ch;
    let setup = [
        channel.assertQueue(config.amqp_queue),
    ];

    return Promise.all(setup);
});

const PORT = 8080;
var app = express();

// middleware declaration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//The API should be extended to allow  the specification of queue name
app.post("/", (req, res) => {
    //no error check
    //reliability, ack, etc. should be supported.
    console.log(`sending msg to queue ${config.amqp_queue} `);
    //complex data transformation should be supported.
    channel.sendToQueue(config.amqp_queue, new Buffer.from(JSON.stringify(req.body)));
    res.send({"send_ack":"OK"});
});


app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`)
})
