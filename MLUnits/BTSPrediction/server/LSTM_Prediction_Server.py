import argparse
import sys
sys.path.append("../queue")
import pika
from Sub_Queue import Sub_Queue
from Pub_Queue import Pub_Queue
from ML_Loader import ML_Loader
import time
import json
import threading
import numpy as np

class LSTM_Prediction_Server(object):
    def __init__(self, model_info, broker_info, queue_info):
        # Init the queue for ML request and load the ML model
        self.name = model_info["name"]
        self.model_path = model_info["path"]
        self.broker_info = broker_info
        self.queue_info = queue_info
        # Init subcribe and publish queue
        self.sub_queue = Sub_Queue(self, self.broker_info, self.queue_info)
        self.pub_queue = Pub_Queue(self, self.broker_info, self.queue_info)
        self.sub_thread = threading.Thread(target=self.sub_queue.start)
        self.model = ML_Loader(model_info)
        
    def ML_prediction(self, pas_series):
        # Making prediciton
        batch_size = pas_series.shape[0]
        result = self.model.prediction(pas_series, batch_size)
        result = result.reshape(result.shape[1],result.shape[2])
        # Load the result into json format
        data_js = {
            "LSTM": float(result[0]), 
        }
        self.print_result(data_js)
        return json.dumps(data_js)
    
    def message_processing(self, ch, method, props, body):
        # Processing message from client
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
        self.pub_queue.send_data(props.reply_to, str(response), props.correlation_id)
 
    def print_result(self, data):
        prediction = ""
        for key in data:
            prediction += "\n# {} : {} ".format(key,data[key])

        prediction_to_str = f"""{'='*40}
        # Prediction Server:{prediction}
        {'='*40}"""
        print(prediction_to_str.replace('  ', ''))
    
    def start(self):
        self.sub_thread.start()
    
    def stop(self):
        self.sub_queue.stop()
        