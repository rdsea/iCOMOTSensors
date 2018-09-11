# Simple emulating sensor

This is used to emulate a sensor. It will get a real sensor data and send the data to different outputs:

- console
- http
- mqtt

## Configuration

Make sure you specify the configuration in config.json. Check config.sample.json for an example. For MQTT, using protocolOptions to define the topic:

"protocolOptions":{
  "topic":"abc"
}
