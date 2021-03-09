## Cloud sub-system ingestion script

Provides scenario specific (i.e. gpon specific iot sensors) ingestion into cassandra database

Requires a cassandra database to ingest to and a Kafka broker to subscribe to. 
#### requirements
* python3 for running the ingestion script.

#### usage
Execute `python3 ingestor.py "kafka_broker_locations"`