## Cloud broker configuration

This provides a configuration for setting up a scalable cloud broker for cloud sub-system of the monitoring scenario.

## Current configuration

* uses [kafka](https://kafka.apache.org) as the cloud broker.
* Customized JMX enabled **application specific** version of kafka built on top of https://hub.docker.com/r/wurstmeister/kafka

#### Requirements:
* docker and docker-compose

#### Usage:
* run `docker-compose up`

## Changes and Adaptation

* Running Kafka with VMs: in practice, Kafka needs powerful resources so that one might setup Kafka with VMs. 

* Different brokers can be used. For example, IoT Hub/PubSub from Azure. Google or Amazon Services can be used. In this case, [Cloud Ingestion Provider](../CloudIngestorProvider) must be changed/updated to take data from the right message broker.
