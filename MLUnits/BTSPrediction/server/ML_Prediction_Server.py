import argparse
import time
import json
import pika
from ML_Loader import ML_Loader
import sys
sys.path.append("../queue")
from Queue_Handler import Queue_Handler


flag = True

class ML_Prediction_Server(object):
    def __init__(self, amqp_host):
        # Init the queue for ML request and load the ML model
        self.queue = Queue_Handler(self, amqp_host, 'topic_bts', 'topic', 'bts_queue', 'server')
        self.loader = ML_Loader()

    
    def ML_prediction(self, index, value, threshold):
        # Making prediciton using loader
        svlr = self.loader.single_var_LR(index)
        mvlr = self.loader.multi_var_LR(index, value, threshold)
        dnnsr = self.loader.DNN_single_regression(index)
        dnnmr = self.loader.DNN_multi_regression(index, value, threshold)

        # Load the result into json format
        data_js = {
            "SVLR": float(svlr), 
            "MVLR": float(mvlr), 
            "DNNSR": float(dnnsr), 
            "DNNMR": float(dnnmr)
        }
        self.print_result(data_js)
        return json.dumps(data_js)
    
    def message_processing(self, ch, method, props, body):
        # start calculate response time
        start_time = time.time()
        # load json message
        predict_value = json.loads(str(body.decode("utf-8")))
        index = float(predict_value["index"]) 
        station_id = float(predict_value["station_id"])
        data_point = float(predict_value["data_point"])
        alarm_id = float(predict_value["alarm_id"])
        value = float(predict_value["value"])
        threshold = float(predict_value["threshold"])

        # Call back the ML prediction server for making prediction
        response = self.ML_prediction(index, value, threshold)

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
        