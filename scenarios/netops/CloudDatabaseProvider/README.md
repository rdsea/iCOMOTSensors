# Cloud database configuration
Cloud database provider is used to store monitoring from IoT. We ingest  incoming data from [CloudBrokerProvider](../CloudBrokerProvider) into the cloud database.

## Current deployment

* uses [cassandra](https://cassandra.apache.org) as the cloud nosql database.
* uses GPON monitoring data as an example, so the database schema is specified for GPON data.
*
#### Requirements:
* docker and docker-compose

#### Usage:
* run `docker-compose up` to start the cassandra cluster
* login onto the cqlsh terminal of the cluster and execute `cassandra_commands.sql` to create the GPON database.

## Scenario changes/adaptation

* Databases:
  - use other databases, such as [CockroachDB](https://www.cockroachlabs.com/) or public cloud databases like [Big Query](https://cloud.google.com/bigquery), [Azure Cosmos](https://azure.microsoft.com/en-us/services/cosmos-db/)
  - use Datalake, such as [Delta Lake](https://delta.io/)
* Data schemas
  - depending on the data stored and the database selected, the data schema should be changed/adapted.
* Change the ingestion program: corresponding ingestion programs must be developed. See [the Ingestion Provider](../CloudIngestorProvider)
