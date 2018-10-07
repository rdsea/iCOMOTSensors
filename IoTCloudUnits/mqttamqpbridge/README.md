# Plain transformation of CSV to JSON through MQTT/AMQP

This unit performs a simple transformation of CSV data to JSON data and MQTT/AMQP. It is used to demonstrate a simple interoperability problem due to syntax and protocol issues.

## Configuration

CSV data sent to MQTT/AMQP broker (in) will be transformed to JSON sent to MQTT/AMQP. Both MQTT and AMQP brokers are needed.

## APIs.

### running

npm start

### Check the availability

curl -X GET http://localhost:8080/  

It will also return a list of APIs.

### Define an MQTT input/output:

MQTT data source: Using the API /mqtt/in/subscribe and specify input endpoint and topic,

curl -X POST http://localhost:8080/mqtt/in/subscribe \
  -H 'Content-Type: application/json' \
  -d '{
	"endpoint":"mqtt://m23.cloudmqtt.com:17510",
	"topic": "testingcsvjson"
}'

MQTT data sink: similar but using /mqtt/out/connect.

Using  mqtt/[in|out]/disconnect to disconnect input/output MQTT

### Define an AMQP input/output

AMQP data sink: Using the API /amqp/out/connect and specify input endpoint, exchange name and exchange type:

curl -X POST \
  http://localhost:8080/amqp/out/connect \
  -H 'Content-Type: application/json' \
  -d '{
	"endpoint":"amqp://chimpanzee.rmq.cloudamqp.com",
    "exchange":"amq.direct",
    "routing_key":"testingcsvtojson"
}'

AMQP data source: similar but using /amqp/in/subscribe.

Using  amqp/[in|out]/disconnect to disconnect input/output AMQP
