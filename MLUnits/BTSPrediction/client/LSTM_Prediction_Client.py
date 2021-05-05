import sys
import pika
sys.path.append("../queue")
from Sub_Queue import Sub_Queue
from Pub_Queue import Pub_Queue
import time
import json
import uuid
import random
import pandas as pd
import threading


class LSTM_Prediction_Client(object):

    def __init__(self, client_info):
        # Init object information
        self.broker_info = client_info["broker_service"]
        self.queue_info = client_info["queue_info"]
        # Init subcribe and publish queue
        self.sub_queue = Sub_Queue(self, self.broker_info, self.queue_info)
        self.pub_queue = Pub_Queue(self, self.broker_info, self.queue_info)
        self.sub_thread = threading.Thread(target=self.sub_queue.start)
            
    # Process message return from server
    def message_processing(self, ch, method, props, body):
        predict_value = json.loads(str(body.decode("utf-8")))
        pre_val = predict_value["LSTM"]
        dict_predicted = {
            "LSTM": pre_val
        }
        self.ml_response = {"Prediction": dict_predicted}
        self.print_result(self.ml_response)


    # Send prediction request
    def send_request(self, dict_mess):
        # init an uniques id for each request
        self.corr_id = str(uuid.uuid4())
        # set routing key when send data to the Exchange
        routing_key = self.queue_info["in_routing_key"]
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
        # Send request using publish queue
        self.pub_queue.send_data(routing_key, body_mess, self.corr_id)
        print("Data sent")

    
    def publish_message(self, file):
        raw_dataset = pd.read_csv(file)
        raw_dataset = raw_dataset.astype({'norm_value':'float','norm_1':'float', 'norm_2':'float', 'norm_3':'float', 'norm_4':'float', 'norm_5':'float', 'norm_6':'float'})

        print("Sending request...")
        for index, line in raw_dataset.iterrows():
            time.sleep(random.uniform(0.2, 1))
            # Parse data
            dict_mess = {
                "norm_1" : float(line["norm_1"]),
                "norm_2" : float(line["norm_2"]),
                "norm_3" : float(line["norm_3"]),
                "norm_4" : float(line["norm_4"]),
                "norm_5" : float(line["norm_5"]),
                "norm_6" : float(line["norm_6"])
            }
            # print("Sending request: {}".format(line))
            # Publish data to a specific topic
            self.send_request(dict_mess)
    
    def print_result(self, data):
        prediction = ""
        for key in data["Prediction"]:
            prediction += "\n# {} : {} ".format(key,data["Prediction"][key])

        prediction_to_str = f"""{'='*80}
        # Prediction Client:{prediction}
        {'='*80}"""
        print(prediction_to_str.replace('  ', ''))

    def start(self):
        self.sub_thread.start()

