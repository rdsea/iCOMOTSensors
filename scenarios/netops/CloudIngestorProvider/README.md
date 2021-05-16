## Cloud sub-system ingestion provider

This presents a specific ingestion provider that takes data from a messaging system service and ingests the data into a database service.

## Current deployment

The current provider is built for a specific scenario with GPON monitoring data in which
* the messaging system is Kafka. See [CloudBrokerProvider](../CloudBrokerProvider)
* the database is cassandra. See [CloudDatabaseProvider](../CloudDatabaseProvider)
* the ingestion unit is a python code that can be deployed in a container.

#### requirements
* python3 for running the ingestion script.

#### usage
Execute `python3 ingestor.py "kafka_broker_locations"`

## Changes/Adaptation
* Many different ways of ingestion can be implemented, e.g., using workflows and other techniques
* Many different brokers and databases can be changed. For this new ingestion units must be implemented. 
