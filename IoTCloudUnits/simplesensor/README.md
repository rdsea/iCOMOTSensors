# Simple emulating sensor

This is used to emulate a sensor. It will get a real sensor data and send the data to different outputs:

- console
- http
- mqtt

One can also implement it as a real sensor by modifying the

function start(){
}

in src/index.js

## Configuration

Make sure you specify the configuration in config.json. Check config.sample.json for an example. For MQTT, using protocolOptions to define the topic:

"protocolOptions":{
  "topic":"abc"
}
