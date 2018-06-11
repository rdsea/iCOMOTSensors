const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config");
const amqp = require('amqplib');

let connection = null;
let channel = null;

console.log(`connecting to amqp broker at ${config.amqp_uri}`);
amqp.connect(config.amqp_uri).then((conn) => {
    console.log(`successfully conencted to ${config.amqp_uri}`);
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

app.post("/", (req, res) => {
    console.log(`sending msg to queue ${config.amqp_queue} `);
    channel.sendToQueue(config.amqp_queue, new Buffer(JSON.stringify(req.body)));
});


app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`)
})