# IoT Predictive Maintenance using ML

In this scenario, we illustrate the example of using machine learning and IoT data pipeline to support predictive maintenance.

## ML and other services/units

We use [ML Units for BTS Prediction](../../MLUnits/BTSPrediction) for:
- create ML services by deploying ML models into a service
  - the service accepts requests from messaging systems (currently using AMQP)
- using other units/services for emulating sensors
- ML clients can take data from sensors, preparing data for ML requests  and sending the requests to the ML service
  - > Currently [a ML client](../../MLUnits/BTSPrediction/client) just reads pre-processing data from files. A developer can change the code to read data from MQTT (e.g., using our [IoTCloudUnits](../../IoTCloudUnits/)) and to perform the data preprocessing
