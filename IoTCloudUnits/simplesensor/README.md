# Simple emulating sensor

## Overview
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

## Running with Docker

Unless the Docker is built with specific configuration by having dataset and configuration built with the Docker, we will need to map external configuration file and dataset to internal configuration file and dataset.  This is used when
each docker simple sensor can be used for a different dataset, the following steps can be done

In the host machine:

* prepare a dataset file
* automatically create a configuration file: not that the path of the dataset must be correct.

Then expose files and run docker. Assume that the configuration file config.json is in /var/tests (and the dataset is also in the same directory)

$docker run -v /var/tests:/var/tests  simplesensor npm start -- -c /var/tests/config.json -i [milliseconds]

## Tests

Running:
```
$npm start -- -c samples/config.sample.json -i 5000
```
For Docker:
```
$docker build -t simplesensor .

$docker run -v $PWD/samples/Docker-config:/var/tests  test npm start -- -c /var/tests/config.json
```
## Creating emulating sensors for IoT-sensor-as-a-provider

Each sensor can be built with an Docker image by providing a separate dataset.

- Prepare the config.file
- Put dataset as data.csv in the root directory.
- Modify docker-build.sh if needed to indicate the location of docker hub.
- Build the docker.

Repeat the above-mentioned instruction with different datasets for different docker image names, we will have samples of sensors.
