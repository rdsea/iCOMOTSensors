# MQTT to Kafka mini-batching edge-cloud bridge

This bridge is used to move data from the edge to the cloud.

## Current deployment
This unit subscribes to a mqtt topic from the edge broker and batches it in fixed interval to the cloud broker which is kafka in our current deployment.

This is an **application** specific mqtt to kafka bridge. Meaning it will only work on the GPON sensor data.

#### requirements
* docker and docker-compose

#### usage
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

* For other scenarios with different monitoring data,  the data converter will be different (see [converter.py](converter.py)). Therefore, one must change the data converter

* The batching strategies can also be optimized

* Finally the cloud broker can be based on other technologies, e.g., Azure IoT Hub, Google Cloud Pub/Sub, etc. In this case, different converters will be needed. See [CloudBrokerProvider](../CloudBrokerProvider) for cloud messaging systems.
