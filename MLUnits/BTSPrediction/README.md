#  The BTS Prediction Machine Learning Units

These units are  used to predict the failure event at base transceiver stations applying 4 ML models.

## Models
* DNN Multi Regression
* DNN Single Regression
* Multi Var LR
* Single Var RL

## Data
The description of data is in [bts data](../../data/bts/README.md) and a [small data file](data/1160629000_121_308_test.csv) is within this directory.

Many months of data are not shared here, available based on the discussion.

## Simple test service unit
The test service unit includes:
- A message queue handler manage prediction requests using RabbitMQ
- A ML Loader loads trained models from exported format (in TensorFlowLite)
- A Server manage the work flow
### Requirements
- Python3
- Pika
- Docker
- TensorFlow/TensorFlowLite
### Running the experiment
- Start RabbitMQ using docker composed by running the script (run.sh) in **server** folder
- Start ML_Prediction_Server.py
- Send request to the queue with message is a json object including [index, stationid, datapointid, alarmid, value, threshold], or try using the example client code with our data by starting Send_request.py in the client directory

## Authors/Contributions
