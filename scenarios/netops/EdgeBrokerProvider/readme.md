## Edge sub-sytem broker configuration
Edge sub-system versions of dockerized broker artefacts. These are configurations for gpon's edge broker scenario and uses the following external artefacts.
* uses [verneMQ](https://vernemq.com/) as the MQTT queue broker. 
* uses `EdgeBrokerLogger` as a local mqtt data logging.

#### Requirements: 
* docker and docker-compose on the edge sub-system

#### Usage:
* run `docker-compose up` to start all the services