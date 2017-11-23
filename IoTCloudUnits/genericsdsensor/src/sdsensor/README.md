Simple sensor example that reads data from file. 

you need 

   - jar files compiled  from sdcommon and sdcloudconnectivity (including dependecies)
   - a sample of data (e.g., datasample) 
   - log4jmqtt custom mqtt appender to lg4j
   - a configuration file of MQTT server for MQTT connectivity (e.g., cloudmqtt.com)
   
   The configuration file takes this form 
   ```
   {
        "server": "localhost",
        "username": "xxx",
        "password": "xxx",
        "port": 1883,
        "clientId": "sensor_topic1_1",
        "topic": "topic1",
        "remoteLogging": false,
        "remoteLoggingBroker":{
          "broker": "tcp://localhost:1883",
          "topic": "test"
        }
    }

```


