# Sensor Ingestion Client

## Build
* `$ npm i` to install dependencies
* `$ npm start` to start the ingestion client
* alternatively use `$ npm run build` to create a single js file in `dist/`

## Configuration
A sample configuration is included in the project `config.sample.yml`. You can declare multiple brokers that subscribe to multiple topics.
Currently the data plugins only support influxdb, generic support is on the drawingboard and already partly implemented, check out the README in the `dataPlugins`.

## Dependencies
### MQTT Broker
The ingestion client requires a running mqtt broker. It's possible to use `test.mosquitto.org` or simply run a local mosquitto broker using docker 

`$ docker run -it -p 1883:1883 -p 9001:9001 eclipse-mosquitto`.

### Influxdb
A running influxdb instance must be provided in the configuration. To run one on your local machine you canuse docker 

`$ docker run -p 8086:8086 -v influxdb:/var/lib/influxdb influxdb`.

## Sensor data
You can use the iCOMOT sensor located in this repo, just follow the build and deploy instructions there. However for simple testing purposes the node mqtt package has a cli that allows you to quickly send data to the broker. Here is an example 

`$ mqtt pub -t myTopic -h localhost -p 1883 -m '{"value": "test"}'` 

For more information check out the node mqtt package docs.