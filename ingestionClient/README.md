# Sensor Ingestion Client

## Build
* `$ npm i` to install dependencies
* `$ CONFIG=<config file> npm start` to start the ingestion client

The CONFIG environment variable is necessary to tell the ingestion client where its configuration file is

## Configuration
A sample configuration is included in the project `config.sample.yml`. You can declare multiple brokers that subscribe to multiple topics.
Currently this project supports BigQuery and InfluxDB, extra data providers can be added easily by simply creating a plugin, check out the README in the `dataPlugins` and look at the existing plugins.

## Dependencies
### MQTT Broker
The ingestion client requires a running mqtt broker. It's possible to use `test.mosquitto.org` or simply run a local mosquitto broker using docker 

`$ docker run -it -p 1883:1883 -p 9001:9001 eclipse-mosquitto`.

## Sensor data
You can use the iCOMOT sensor located in this repo, just follow the build and deploy instructions there. However for simple testing purposes the node mqtt package has a cli that allows you to quickly send data to the broker. Here is an example 

`$ mqtt pub -t myTopic -h localhost -p 1883 -m '{"value": "test"}'` 

For more information check out the node mqtt package docs.
