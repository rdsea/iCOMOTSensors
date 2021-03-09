## Cloud kubernetes monitoring configuration
Kubernetes versions of monitoring artefacts. These are configurations for monitoring scenario and uses the following external artefacts.
* uses [prometheus](https://prometheus.io) as the time-series database. 

#### Requirements: 
* a running openshift kubernetes cluster and openshift cli locally

#### Usage:
* This should be deployed last. 
* First configure the [prometheus config/prometheus.yml](./prometheus/prometheus.yml) to the correct ports and ip locations 
* complete `oc login` 
* run `oc apply -f prometheus-monitoring.yml` to start prometheus in the openshift k8s cluster