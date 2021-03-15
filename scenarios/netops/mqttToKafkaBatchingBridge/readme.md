## MQTT to Kafka mini-batching edge-cloud bridge

This subscribes to a mqtt topic from the edge broker and batches it in fixed interval to the cloud broker which is kafka in our scenario.

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

