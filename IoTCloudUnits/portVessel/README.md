# Port Vessel units
This code is used to emulate a vessel. A Vessel will listen messages from a queue and act accordingly.

## Setup

It requires

* MQTT

## Configuration

Information about the vessel and communication is defined in config.yml.
Each vessel will have a unique name and listen a topic from a queue.

## Simple scenario
We can have two scenarios:

### Vessel management company and its vessels
It illustrates the case that the vessels have to communicate with its management company.

* a vessel company will have an MQTT broker
* each vessel of the company will have a topic for exchanging Information
* a set of commands and messages are used for emulating IoT information exchanged between vessels and the vessel company.

You can emulate a large number of vessels by running different instances of the Vessel dockers (or using the port-control-vessel-provider).

### Vessels and the port authority
It reflects the vessels communication with the port authority. The way to do is similar to the previous case (vessels and its management company) where we can replace the management company by the port authority.

## Complex Scenarios

For complex scenarios, we can build some of them.

* Create an instance of the MQTT broker on-demand (using our MQTT provider), then creating many vessels. This basically illustrates a resource slice for a vessel company to exchange the data.
* Create several instances of vessel companies (described above), then create various data transformers/flows (using our node-red data transformer provider) to deploy different flows to transform data from one vessel company to another vessel company.

## Authors

- Lingfan Gao
- Hong-Linh Truong
