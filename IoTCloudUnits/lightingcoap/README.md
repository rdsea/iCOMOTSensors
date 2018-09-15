# Simple CoAP lighting service

This is just simple CoAP lighting service. The assumption is a there is a set of lights, each light is controlled via a CoAP server.

- The CoAP server for a light receives a json command and performs the action

- A set of lights can be initialized using a multicast group of CoAP servers.

- Each light can define its own control function: it is up to the user to do this. We just provide an simple console output function.

## Configuration

- each light needs a configuration about control function. See "lightcontrollerconfig.json" as an example and the corresponding control function is in ext/userdefinedcontroller.js

- for running a set of lights, a configuration file is needed, see lightconfig.json as an example.

## Tests

Run a set of lights:

$node src/arrayoflight.js -i lightconfig.json

Run a test client:

$node tests/simple_client.js -a 224.0.1.186
