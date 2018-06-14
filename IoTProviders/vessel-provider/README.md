# Vessel Provider

This is a provider of vessels for the valencia seaport scenario. The vessel provider will create vessels and configure vessels to register the broker for communication. Furthermore, the vessel information will be register to the port control service

## Depending units

* Vessel: in IoTCloudUnits package portVessel
* Port control service: in IoTCloudUnits/port-control-service

## Configuration

The provider expects the URL of the Port control as an enviroment variable PCS_URL.

The docker version expects by default http://pcs:9999, you can override this using docker
