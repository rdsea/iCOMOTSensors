# MQTT Bridge

This is a standalone java application that provides a bridge between
an MQTT broker and Kafka. The application has been designed so that
support for other providers is very easy (e.g ActiveMQ). 

The bridge is bidirectional. Kafka topics will be published in MQTT
and MQTT topics will be published in Kafka.

The application launches two threads for Kafka: one for consume
and one for publish respectively. The MQTT client is asynchronous
event based.

For integration of future cloud brokers like ActiveMQ or RabbitMQ
simply follow the same threaded architecture in the project and
create a concrete `AbstractBridge` instance

## Build
simply execute `$ mvn package` and the corresponding executable
will be located in `target/mqtt-bridge-1.0-SNAPSHOT-jar-with-dependencies.jar`

## Execute
run ` java -jar mqtt-bridge-1.0-SNAPSHOT-jar-with-dependencies.jar -h`
for usage options.