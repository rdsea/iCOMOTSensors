## Cloud database configuration
Cloud database provider for ingestion of incoming data

* uses [cassandra](https://cassandra.apache.org) as the cloud nosql database. 
* creates the GPON database.
#### Requirements: 
* docker and docker-compose

#### Usage:
* run `docker-compose up` to start the cassandra cluster
* login onto the cqlsh terminal of the cluster and execute `cassandra_commands.sql` to create the GPON database. 

