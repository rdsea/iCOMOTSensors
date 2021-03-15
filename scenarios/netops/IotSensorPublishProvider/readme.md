## IoT sensors providers

Provides scenario specific (i.e. gpon specific iot sensors) with ability to vary the duration, and number of sensors.

Requires a MQTT broker to publish to. In this GPON scenario, this will be an edge mqtt broker. 
#### requirements
* python3 for running the scripts.

#### usage
Execute `bash multi-sensor.sh number_of_sensors duration_of_sensors`

---
**TODO**:  Look into existing code in utils (https://github.com/rdsea/IoTCloudSamples/blob/master/utils/plainmqttpublisher.py ) and https://github.com/rdsea/IoTCloudSamples/tree/master/IoTCloudUnits/simplesensor and check if we can integrate the sensor publisher with configuration provider for GPON.