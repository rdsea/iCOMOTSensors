# Overview
This directory includes individual units for establishing IoT Cloud Examples

# List of Units
For specific informtion on each of the units please view their detailed README

## MQTT/AMQP cvsToJson

The code is in csvToJson directory. This unit is used to conver CVS to JSON format with MQTT/AMQP as input/output protocols.

## Generic Sensor
A virtual java sensor that reads from a csv file. Can be configured to produce data to an MQTT Broker

## Ingestion Client
An ingestion client that can read from a list of configured brokers and their topics. The ingestion client can be extended with
data plugins (e.g. Google BigQuery).

## MQTT Bridge
An MQTT Bridge that connects an mqtt broker with kafka. Configured topics from mqtt will be bridged to kafa topics. Configured topics in kafka will be bridged to mqtt topics.
