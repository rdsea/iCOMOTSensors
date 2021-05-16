# IoT sensors providers

The IoT provider emulates IoT sensors.

## Current deployment

Sensors are emulated as python code reading data from files containing real data. The sensors here work with a specific scenario  with ability to vary the duration, and number of sensors.

Sensors sending data require a MQTT broker to publish to. Currently, the MQTT broker is provided by [Edge MQTT Broker Providers](../EdgeBrokerProvider).

Generally, we can have different IoT Sensor Providers, each connects to a separate Edge MQTT Broker Provider.

#### requirements
* python3 for running the scripts.

#### usage
Execute `bash multi-sensor.sh number_of_sensors duration_of_sensors`

## Scenario changes and adaptation

* We also have other emulated sensors [utils/mqtt publisher](../../../utils/plainmqttpublisher.py) and [simple sensor](../../../IoTCloudUnits/simplesensor/) which can be used for IoT Providers
* It is possible that the Edge Broker Provider offers different protocols, like [NATs](https://nats.io/), AMQP. In this case, the emulated sensors must be changed to work with these protocols. See also our [IoT Units](../../../IoTCloudUnits)
* Optimize sensor parameters for different scenarios.
* Change the data format for other types of data
