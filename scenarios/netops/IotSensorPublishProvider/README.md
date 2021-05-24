# IoT sensors providers

The IoT provider emulates IoT sensors.

## Current deployment

Sensors are emulated as python code reading data from files containing real data. The sensors here work with a specific scenario  with ability to vary the duration, and number of sensors.

Sensors sending data require a MQTT broker to publish to. Currently, the MQTT broker is provided by [Edge MQTT Broker Providers](../EdgeBrokerProvider).

Generally, we can have different IoT Sensor Providers, each connects to a separate Edge MQTT Broker Provider.

#### Requirements
* python3 for running the scripts.

#### usage
Execute `bash multi-sensor.sh number_of_sensors duration_of_sensors`

## Scenario changes and adaptation
* In practice, sensors can measure data directly and push the data to the broker. Another way is that the sensor is designed to query data from equipment  - using polling mechanisms (e.g., via SNMP) and convert the queried data to push the data to the broker.
  >at this level, sensors can perform some processing tasks but they should be heavy as further processing can be done at the edge
* We also have other emulated sensors [utils/mqtt publisher](../../../utils/plainmqttpublisher.py) and [simple sensor](../../../IoTCloudUnits/simplesensor/) which can be used for IoT Providers
* It is possible that the Edge Broker Provider offers different protocols, like [NATs](https://nats.io/), AMQP. In this case, the emulated sensors must be changed to work with these protocols. See also our [IoT Units](../../../IoTCloudUnits)
* Optimize sensor parameters for different scenarios.
* Change the data format for other types of data
