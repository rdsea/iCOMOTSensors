# Simple MQTT/AMQP To CoAP Unit

This unit performs a simple protocol translation from AMQP/MQTT to CoAP.

## Configuration

JSON data sent to MQTT/AMQP broker (in) will be pushed to a CoAP server or a CoAP multicast group. MQTT/AMQP Brokers and CoAP servers are available.

The assumption is that the topic/queue of AMQP/MQTT will be mapped to a resource of CoAP based on the following rule:

*topic --> coap://endpoint/topic*

We support only a single output CoAP server/multicast group.

## APIs.

### Running
```
$npm start
```
### Check the availability

curl -X GET http://localhost:8080/

It will also return a list of APIs.

### Define an MQTT input:

MQTT data source: Using the API /mqtt/in/subscribe and specify input endpoint and topic,

curl -X POST http://localhost:8080/mqtt/in/subscribe \
  -H 'Content-Type: application/json' \
  -d '{
	"endpoint":"mqtt://m23.cloudmqtt.com:17510",
	"topic": "testingcsvjson"
}'

Using  mqtt/in/disconnect to disconnect input MQTT

### Define an AMQP input

AMQP data source: similar to MQTT but using /amqp/in/subscribe.

Using  amqp/in/disconnect to disconnect input  AMQP
