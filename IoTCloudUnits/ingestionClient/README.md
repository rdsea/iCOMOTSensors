# Sensor Ingestion Client

## Build
* `$ npm i` to install dependencies
* `npm start` to start the ingestion client

## Configuration
We assume that we consume valid JSON data from the mqtt broker


A sample configuration is provided in the `config.sample.yml`. Data storage should be handled by a remote serivice through rest that exposes
the endpoint `POST /insert` with the following object 

```
{
    data: {
        key: value,
        key: value,
    }
}
```

## Dependencies
### MQTT Broker
The ingestion client requires a running mqtt broker. It's possible to use `test.mosquitto.org` or simply run a local mosquitto broker using docker 

`$ docker run -it -p 1883:1883 -p 9001:9001 eclipse-mosquitto`.

## Sensor data
You can use the iCOMOT sensor located in this repo, just follow the build and deploy instructions there. However for simple testing purposes the node mqtt package has a cli that allows you to quickly send data to the broker. Here is an example 

`$ mqtt pub -t myTopic -h localhost -p 1883 -m '{"value": "test"}'` 

For more information check out the node mqtt package docs.
