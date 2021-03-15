## Cloud kubernetes analytics configuration
Kubernetes versions of analytics artefacts. These are configurations for the analytics artefacts in the gpon scenario and uses the following external artefacts.
* uses [spark](https://spark.apache.org) as the in-memory stream processing system. 

#### Requirements: 
* a running openshift kubernetes cluster and openshift cli locally

#### Usage:
* complete `oc login` 
* run `oc apply -f spark-template.yml` to start apache spark in the openshift k8s cluster