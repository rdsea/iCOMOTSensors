# HTTP To AMQP Gateway

This is a simple gateway which accepts input data from HTTP REST API and push the data to AMQP.

It is one implementation of protocol interoperability

## Configuration

Configuration of AMQP should be in config.yml. One sample is [config.yml.sample](config.yml.sample). For testing purpose, you can use a free RabbitMQ instance from [CloudAMQP](https://cloudamqp.com)

## Start the service and send data
To start the service, you can do:
```
$node index.js

```

To post a data, the data must be in JSON. One example is [measurement-sample.json](measurement-sample.json). Example of a POST:
```
curl --location --request POST 'http://localhost:8080' \
--header 'Content-Type: application/json' \
--data-raw '{
    "measurement": "ruuvitag",
    "time": "2021-01-05T10:37:10.561842Z",
    "fields": {
        "pressure": 1030.83,
        "acceleration_z": 640,
        "acceleration": 1056.7875850898324,
        "humidity": 63.29,
        "measurement_sequence_number": 15356,
        "movement_counter": 90,
        "battery": 2.977,
        "temperature": 23.71,
        "acceleration_y": -360,
        "tx_power": 4,
        "acceleration_x": 760
    }
}'
```
You can test if you can receive the information via AMQP by using the [plainamqpsubscribe.py](../utils/plainamqpsubscribe.py) with the configured AMQP information:

```
$export AMQPURL="amqp://...."
$python3 plainamqpsubscriber.py --queuename ...
```
## Todo

* Dynamic queue setting for POST
* Transformation of sent data 
