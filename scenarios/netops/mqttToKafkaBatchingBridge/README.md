# MQTT to Kafka mini-batching edge-cloud bridge

This bridge is used to move data from the edge to the cloud.

## Current deployment
This unit subscribes to a mqtt topic from the edge broker and batches it in fixed interval to the cloud broker which is kafka in our current deployment.

The current implementation is an **application** specific mqtt to kafka bridge for specific data.

#### Requirements
Currently we use:

* docker and docker-compose

#### Usage
* update the docker-compose file, with the appropriate mqtt and kafka broker environment variables.
* run `docker-compose up`

**Required environment variables**
```yaml
KAFKA_BOOTSTRAP_SERVERS: '192.168.1.12:32812,192.168.1.12:32814'
MQTT_HOST: broker
MQTT_PORT: 1883
EDGE_BROKER_NAME: 'edge_broker_gcp'
BATCH_POOL_FREQUENCY: 10
```

## Scenario changes/adaptation

* The MQTT edge broker and other components in the edge can be deployed in a quite powerful edge system. We can have many edge systems. For example: each edge system is deployed for a district.

* For other scenarios with different monitoring data,  the data converter will be different (see [converter.py](converter.py)). Therefore, one must change the data converter.

* We show just a simple data transformation and ingestion. However, components taking data from MQTT can perform various complex analytics at the edge before sending the results to the cloud.

* The batching strategies can also be optimized


* The cloud broker can be based on other technologies, e.g., Azure IoT Hub, Google Cloud Pub/Sub, etc. In this case, different converters will be needed. See [CloudBrokerProvider](../CloudBrokerProvider) for cloud messaging systems.

* Depending on the situation of the edge system, one can also replace the CloudBrokerProvider by another type of systems. For example:
  - the cloud will received data through file-based datalake: in this case, the datalake can take files and ingest files into the datalake. This requires us to change the CloudBrokerProvider and the cloud data ingestion
  - then the edge can use serverless function to submit data to the cloud, instead of sending data to the CloudBrokerProvider.
