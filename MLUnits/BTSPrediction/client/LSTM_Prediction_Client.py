import time
import argparse
import json
import pika
import uuid
import sys
import random
import pandas as pd
sys.path.append("../queue")
from Queue_Handler import Queue_Handler

mean_val = 12.04030374
max_val = 12.95969626

class LSTM_Prediction_Client(object):

    def __init__(self, amqp_host):
        # Connect to RabbitMQ host
        self.queue = Queue_Handler(self, amqp_host, 'lstm_bts', 'topic', 'result', 'client')
          
    # Check if the response is available
    def message_processing(self, ch, method, props, body):
        if self.corr_id == props.correlation_id:
            self.response = body

    # Send prediction request
    def send_request(self, dict_mess):
        self.response = None
        # init an uniques id for each request
        self.corr_id = str(uuid.uuid4())
        # set routing key when send data to the Exchange
        routing_key = "request.lstm"
        # load data to json object
        json_mess = {
            "norm_1": float(dict_mess["norm_1"]), 
            "norm_2": float(dict_mess["norm_2"]), 
            "norm_3": float(dict_mess["norm_3"]), 
            "norm_4": float(dict_mess["norm_4"]),
            "norm_5": float(dict_mess["norm_5"]),
            "norm_6": float(dict_mess["norm_6"])
        }
        body_mess = json.dumps(json_mess)
        # start calculate response time
        start_time = time.time()
        self.queue.send_data(routing_key, body_mess, self.corr_id)
        # print("Data sent")
        while self.response is None:
            self.queue.process_data_events()
        # calculate response time
        response_time = time.time() - start_time
        # read the results
        predict_value = json.loads(str(self.response.decode("utf-8")))
        
        pre_val = predict_value["LSTM"]*max_val+mean_val
        dict_predicted = {
            "LSTM": pre_val
        }
        # calculate accuracy
        accuracy =  (1 - abs((pre_val - float(dict_mess["norm_value"]))/float(dict_mess["norm_value"])))*100
        if accuracy < 0:
            accuracy = 0
        # return prediction analysis
        return {"Prediction": dict_predicted, "ResponseTime": response_time, "Accuracy": accuracy}
    
    def publish_message(self, file):
        raw_dataset = pd.read_csv(file)
        raw_dataset = raw_dataset.astype({'norm_value':'float','norm_1':'float', 'norm_2':'float', 'norm_3':'float', 'norm_4':'float', 'norm_5':'float', 'norm_6':'float'})

        print("Sending request...")
        for index, line in raw_dataset.iterrows():
            time.sleep(random.uniform(0.2, 1))
            # Parse data
            dict_mess = {
                "norm_value" : float(line["norm_value"])*max_val+mean_val,
                "norm_1" : float(line["norm_1"]),
                "norm_2" : float(line["norm_2"]),
                "norm_3" : float(line["norm_3"]),
                "norm_4" : float(line["norm_4"]),
                "norm_5" : float(line["norm_5"]),
                "norm_6" : float(line["norm_6"])
            }
            # print("Sending request: {}".format(line))
            # Publish data to a specific topic
            ml_response = self.send_request(dict_mess)
            self.print_result(ml_response)


        time.sleep(0.2)
    
    def print_result(self, data):
        prediction = ""
        for key in data["Prediction"]:
            prediction += "\n# {} : {} ".format(key,data["Prediction"][key])

        prediction_to_str = f"""{'='*80}
        # Prediction Client:{prediction}
        # ResponseTime: {data["ResponseTime"]}
        # Accuracy: {data["Accuracy"]}
        {'='*80}"""
        print(prediction_to_str.replace('  ', ''))



