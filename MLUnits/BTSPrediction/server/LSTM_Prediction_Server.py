import argparse
import time
import json
import numpy as np
import pika
from ML_Loader import ML_Loader
import sys
sys.path.append("../queue")
from Queue_Handler import Queue_Handler

class LSTM_Prediction_Server(object):
    def __init__(self, amqp_host):
        # Init the queue for ML request and load the ML model
        self.queue = Queue_Handler(self, amqp_host, 'lstm_bts', 'topic', 'rpc_queue', 'server')
        self.loader = ML_Loader()      

    
    def ML_prediction(self, pas_series):
        # Making prediciton using loader
        result = self.loader.LSTM_prediction(pas_series)
        result = result.reshape(result.shape[1],result.shape[2])
        # Load the result into json format
        data_js = {
            "LSTM": float(result[0]), 
        }
        self.print_result(data_js)
        return json.dumps(data_js)
    
    def message_processing(self, ch, method, props, body):
        # start calculate response time
        start_time = time.time()
        # load json message
        predict_value = json.loads(str(body.decode("utf-8")))
        norm_1 = float(predict_value["norm_1"])
        norm_2 = float(predict_value["norm_2"]) 
        norm_3 = float(predict_value["norm_3"]) 
        norm_4 = float(predict_value["norm_4"]) 
        norm_5 = float(predict_value["norm_5"]) 
        norm_6 = float(predict_value["norm_6"]) 
        pas_series =np.array([[norm_1],[norm_2],[norm_3],[norm_4],[norm_5],[norm_6]])
        pas_series = np.array(pas_series)[np.newaxis,:,:]

        # Call back the ML prediction server for making prediction
        response = self.ML_prediction(pas_series)

        # Response the request
        ch.basic_publish(exchange='',
                        routing_key=props.reply_to,
                        properties=pika.BasicProperties(correlation_id = \
                                                            props.correlation_id),
                        body=str(response))
        # calculate the response time
        response_time = time.time()-start_time
        ch.basic_ack(delivery_tag=method.delivery_tag)        

    def print_result(self, data):
        prediction = ""
        for key in data:
            prediction += "\n# {} : {} ".format(key,data[key])

        prediction_to_str = f"""{'='*40}
        # Prediction Server:{prediction}
        {'='*40}"""
        print(prediction_to_str.replace('  ', ''))
        