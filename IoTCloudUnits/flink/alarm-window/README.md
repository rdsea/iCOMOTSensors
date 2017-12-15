# BTS alarm window streaming job

This Apache Flink streaming job determines what alarms occur together
at during a given time window.

If a given time window only contains one alarm, no result is provided.

## Input
The streaming job accepts an `MQTT broker and topics` as source.
The data format expected is a `JSON` format of BTS alarm readings.

## Output 
The streaming job publishes `JSON` data as output with information on 
the deviation, parameter and the time window. The output should be 
published to a `RabbitMQ` broker.

## Configuration

The streaming job accepts a `JSON` configuration file

````
{
    "mqttUri": "tcp://localhost:1883",
    "mqttClientId": "test",
    "mqttTopics": [
       "test"
    ],
    "window": 5,
    "rabbitHost": "localhost",
    "rabbitPort": 5672,
    "rabbitUser": "guest",
    "rabbitPassword": "guest",
    "rabbitvHost": "/",
    "rabbitTopic": "queue"
}

````