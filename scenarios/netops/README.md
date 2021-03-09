## GPON Monitoring Scenario
This collates the configurations and scripts of external artefacts providers that the GPON scenario uses.

## Requirements
The code is developed in python3 and almost all the components (external artefacts) that we are using are dockerized. To run this simulation, we will need, 
* Docker and docker-compose
* python3 (optional for some components)
* Kubernetes (They were tested on openshift k8s platform)

Each of the provider has a readme on how to deploy it.

---

#### note
It is up to the user to make sure that the configuration file is well defined (e.g. topic names match between ingestionClients and sensors)