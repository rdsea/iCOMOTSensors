# Simple Firewall as a Network Function for Kubernetes

This provider will perform firewall actions, as network function, for a Kubernetes system.

One example is that during runtime some data exchange is needed and the network function will be provisioned and configured on-demand.

## Installation

The service can be installed with access to a kubernetes system. Currently, the access is made available and kubectl* can be used.

## Usage
One must be familiar with Kubernetes network policies control, available at (https://kubernetes.io/docs/concepts/services-networking/network-policies/)

### Check availability
curl -X GET http://localhost:3008/kubefw

### List available policies
curl -X GET  http://localhost:3008/kubefw/list
