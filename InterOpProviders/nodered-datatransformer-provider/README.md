# Introduction

this is a service for data transformation based on node-red.
the idea is that the provider offers "node-red service" as a resource. One consumer can request a resource then submit workflows to the resource to perform data transformation. Therefore during runtime, such resouces can be used for interoperability.

Supported by the Inter-IoT.

## Configuration

### Kubernetes requirements and setup

We have tested with Google Cloud Platform Kubernetes and Minikube/Kubernetes  in a single server. Note the following settings:

* all kube* commandlines should be in the execution path of the service
* $export MINIKUBE_NODEPORT=True for minikube without loadbalancer, and external ip cannot be exposed, we will use nodeport for exposing service. In this case the command "minikube" must be in the execution path.

The service will use a default node-red container. However, this can be replaced by a customed one.

### Running services

`npm start`

### Examples

Check if the service is available:

* curl -X GET http://[hostname]:3004/datatransformer

Create a new data transformer:

* curl -X POST http://[hostname]:3004/datatransformer

List existing transformer resources:

* curl -X GET http://[hostname]:3004/datatransformer/list

Get detailed information about a transformer with the id =datatransformer1528623333334:

* curl -X GET http://daredevil:3004/datatransformer/datatransformer1528623333334

Remove a transformer with the id = datatransformer1528623333334
* curl -X DELETE http://daredevil:3004/datatransformer/datatransformer1528623333334


## Authors

Hong-Linh Truong
Lingfan Gao
Michael Hammerer
