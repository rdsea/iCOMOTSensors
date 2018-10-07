# Virtual DataHub Sensors

This unit implements virtual datahub sensor: sensors that take data from an IoT datahub of an IoT platform and send to another broker. The idea is to support dynamic interoperability in accessing data.


## Configuration

the input data broker and the output data broker must be configured. They can be based on AQMP or MQTT


## Running
$export NODE_ENV=production
$npm start

## Run as a docker
