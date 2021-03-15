## Cloud dockerized monitoring configuration
Dockerized versions of monitoring artefact. These are configurations that are required for monitoring scenario and uses the following external artefacts.
* uses [prometheus](https://prometheus.io) as the time-seires database. 
* Uses grafana for visualization

#### Requirements: 
* docker and docker-compose

#### Usage:
* This should be deployed last. 
* First configure the [prometheus/prometheus.yml](./prometheus/prometheus.yml) to the correct ports and locations 
* run `docker-compose up` to start prometheus and grafana
 