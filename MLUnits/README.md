# Machine Learning Units
## The BTS Prediction
This experiment is used to predict the failure event at base transceiver stations applying 4 ML models. The application include:
- A message queue handler manage prediction requests using RabbitMQ
- A ML Loader loads trained models from exported format (in TensorFlowLite)
- A Server manage the work flow
## Requirements
- Python3
- Pika
- Docker
- TensorFlow/TensorFlowLite
## Running the experiment
- Start RabbitMQ using docker composed by running the script (run.sh) in **server** folder
- Start ML_Prediction_Server.py
- Send request to the queue with message is a json object including [index, stationid, datapointid, alarmid, value, threshold]