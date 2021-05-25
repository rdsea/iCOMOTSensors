#  The BTS Prediction Machine Learning Units

These units are  used to predict the failure event at base transceiver stations applying 4 ML models.

## Data
The description of raw data is in [bts data](../../data/bts/README.md) and a [small pre-processing data file](data/) is within this directory. The pre-processing data was transformed from the raw data for the ML.

Many months of raw data are not shared here, available based on the discussion with the author.

## Models
* DNN Multi Regression
* DNN Single Regression
* Multi Var LR
* Single Var RL
* LSTM single series

The ML unit relies on ML models trained with the data mentioned above.
>TODO: a short info to indicate where is the code for training

### LSTM single series
This model is
* applied to a single station for a single parameter (e.g., Load of Power Grid)

Further trained information can be found in [this paper](https://research.aalto.fi/files/56621517/main.pdf).

## Simple test case
A simple test case includes:
- A message broker, using RabbitMQ,  are used for sending and receiving requests and results
- A [client-v1](client-v1/) sends normalized data for prediction and gets results
- A [ML Unit as a service](service-v1/) loads [trained models](models/) from exported format (in TensorFlowLite), obtains requests from the the broker, performs the prediction and returns the predicted value

>TODO:
- A client-v2 just sends raw sensoring data to a ML service v2 which performs data preprocessing and other data processing tasks and serving

### Requirements
- Python3
- Pika
- Docker
- TensorFlow/TensorFlowLite
### Running the experiment
- Start RabbitMQ using docker composed by running the script (run.sh) in **server** folder
- Start server/bts_prediction_server.py
- Use the example client code with our data

## Authors/Contributions
