import time
import argparse
import json
import pika
import sys
sys.path.append("../queue")
from Queue_Handler import Queue_Handler


class ML_Prediction_Client(object):

    def __init__(self, amqp_host):
        # Connect to RabbitMQ host
        self.queue = Queue_Handler(self, amqp_host, 'topic_bts', 'topic', 'bts_result', 'client')
            
    # Check if the response is available
    def message_processing(self, ch, method, props, body):
        if self.corr_id == props.correlation_id:
            self.response = body

    # Send prediction request
    def send_request(self, dict_mess):
        self.response = None
        # init an uniques id for each request
        self.corr_id = str(dict_mess["index"])
        # set routing key when send data to the Exchange
        routing_key = "request.{}.{}.{}".format(dict_mess["station_id"], dict_mess["data_point"], dict_mess["alarm_id"])
        # load data to json object
        json_mess = {
            "index": float(dict_mess["index"]), 
            "station_id": float(dict_mess["station_id"]), 
            "data_point": float(dict_mess["data_point"]), 
            "alarm_id": float(dict_mess["alarm_id"]),
            "value": float(dict_mess["value"]),
            "threshold": float(dict_mess["threshold"])
        }
        body_mess = json.dumps(json_mess)
        # start calculate response time
        start_time = time.time()
        self.queue.send_data(routing_key, body_mess, self.corr_id)

        while self.response is None:
            self.queue.process_data_events()
        # calculate response time
        response_time = time.time() - start_time
        # read the results
        predict_value = json.loads(str(self.response.decode("utf-8")))
        dict_predicted = {
            "SVLR": float(predict_value["SVLR"]), 
            "MVLR": float(predict_value["MVLR"]), 
            "DNNSR": float(predict_value["DNNSR"]), 
            "DNNMR": float(predict_value["DNNMR"])
            # "Data_quality": float(predict_value["Data_quality"])
        }

        # calculate accuracy
        svlr_acc =  1 - abs((predict_value["SVLR"] - float(dict_mess["ground_truth"]))/float(dict_mess["ground_truth"]))
        mvlr_acc =  1 - abs((predict_value["MVLR"] - float(dict_mess["ground_truth"]))/float(dict_mess["ground_truth"]))
        dnnsr_acc =  1 - abs((predict_value["DNNSR"] - float(dict_mess["ground_truth"]))/float(dict_mess["ground_truth"]))
        dnnmr_acc =  1 - abs((predict_value["DNNMR"] - float(dict_mess["ground_truth"]))/float(dict_mess["ground_truth"]))
        accuracy = max(svlr_acc, mvlr_acc, dnnsr_acc, dnnmr_acc)*100
        # return prediction analysis
        return {"Prediction": dict_predicted, "ResponseTime": response_time, "Accuracy": accuracy}
    
    def publish_message(self, file):
        f = open(file, 'r')
        print("Sending request...")
        for line in f:
            ack = False
            time.sleep(1)
            # Parse data
            data = line.rstrip('\r\n').split(",")
            dict_mess = {
                "index" : float(data[0]),
                "station_id" : float(data[2]),
                "data_point" : float(data[3]),
                "alarm_id" : float(data[4]),
                "value" : float(data[6]),
                "threshold" : float(data[7]),
                "ground_truth": (float(data[5])-1487508915.0)/1000
            }
            print("Sending request: {}".format(line))
            # Publish data to a specific topic
            ml_response = self.send_request(dict_mess)
            self.print_result(ml_response)



        time.sleep(1)
        f.close()
    
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



