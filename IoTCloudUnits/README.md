# Overview
This directory includes individual units for establishing IoT Cloud Examples

## List of Units
For specific informtion on each of the units please view their detailed README

### MQTT/AMQP cvsToJson

The code is in csvToJson directory. This unit is used to convert CVS to JSON format with MQTT/AMQP as input/output protocols.

### Http-Pull GoogleStorage Push

The code is in datastorageArtefact. This unit is used to pull a data from an http uri and push the data to GoogleStorage.

It demonstrates a simple protocol interoperability bridge.

### HTTP Push - AMQP Push

The code is in httpAmqpGateway. This unit is used for protocol interoperability. It accepts data through HTTP REST POST and pushes the data to AMQP broker.

### Generic Alarm Generator

The code is in genericalarmgenerator. This unit is used to simulate alarms (based on some real alarms/info in Valencia port)


### Simple sensor
The code is in simplesensor directory. This unit is used to emulate a sensor (with realistic data provided) which sends data to console, mqtt or http sink.

### Generic Sensor
A virtual java sensor that reads from a csv file. Can be configured to produce data to an MQTT Broker

### Ingestion Client
An ingestion client that can read from a list of configured brokers and their topics. The ingestion client can be extended with
data plugins (e.g. Google BigQuery).

### MQTT Bridge
An MQTT Bridge that connects an mqtt broker with kafka. Configured topics from mqtt will be bridged to kafa topics. Configured topics in kafka will be bridged to mqtt topics.
