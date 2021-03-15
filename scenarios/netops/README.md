## GPON Monitoring Scenario
This collates the configurations and scripts of external artefacts providers that the GPON scenario uses.

#### Requirements
Almost all the components (external artefacts) that we are using are dockerized. To run this simulation, we will need, 
* Docker and docker-compose
* python3 (optional for some components)
* Kubernetes (They were tested on openshift k8s platform)

#### Structure 
```
scenario
│   README.md       
│
└───cloudBrokerProvider
└───cloudDatabaseProvider
└───cloudDockerizedMonitoringProvider
└───cloudIngestorProvider
└───cloudKubernetesAnalyticsProvider
└───cloudKubernetesMonitoringProvider
└───edgeBrokerProvider
└───IoTSensorPublishProvider
└───IoTSensorBatchingBridge
```

All these folders have the readme on the relavant configurations for these external providers and how to run them.

---

#### note
It is up to the user to make sure that the configuration file is well defined (e.g. topic names match between ingestionClients and sensors)