# BTS parameter stability streaming job

This Apache Flink streaming job determines paramter stability within 
a given time window.

Paramter stability is defined as the standard deviation of parameter
values in a given time window. If this deviation exceeds a certian
value, the paramter is not stable within the given time window.

## Input
The streaming job accepts an `MQTT broker and topics` as source.
The data format expected is a `JSON` format of BTS parameter readings.

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
    "deviation": 5,
    "window": 5,
    "rabbitHost": "localhost",
    "rabbitPort": 5672,
    "rabbitUser": "guest",
    "rabbitPassword": "guest",
    "rabbitvHost": "/",
    "rabbitTopic": "queue"
}

````