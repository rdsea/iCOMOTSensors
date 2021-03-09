## MQTT to Kafka mini-batching edge-cloud bridge

This subscribes to a mqtt topic from the edge broker and batches it in fixed interval to the cloud broker which is kafka in our scenario.

This is an **application** specific mqtt to kafka bridge. Meaning it will only work on the GPON sensor data.

#### requirements
* docker and docker-compose

#### usage
* update the docker-compose file, with the appropriate mqtt and kafka broker params[^1].
* run `docker-compose up`


[^1]: params : `params: broker address, broker_port, broker_name, batch_intervals, kafka_brokers_address`