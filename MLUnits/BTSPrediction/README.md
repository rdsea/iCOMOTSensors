
### File system:
#### Models:
This is the directory for published mode. There are both .tlite and .pd versions for each trained model, the models can be accessed from:

```BTSPrediction/models/[Model_name]/[Model_name].tlite``` 
```BTSPrediction/models/[Model_name]/[Model_name].pd```

#### Client:
This is a simple client example to demonstrate how you can use RabbitMQ to send request. Read the data, and send request to an exchange.

#### Server:
This folder contains an example server that receives, and processes the request. RabbitMQ was used as the message broker.

#### Data:
This contains a small dataset provided by a Vietnamese company used for the prediction models.


### Run the BTSPrediction unit:
<ol>
    <li>
    Start the rabitmq server: ./run.sh (you might need to give permission in order to run this file)</li>
    <li>
    Start the server: python3 prediction_server.py</li>
    <li> Star sending the request: python3 send_request.py</li>
</ol>



