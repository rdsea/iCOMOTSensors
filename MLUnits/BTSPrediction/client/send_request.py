import time
import argparse
import json
import pika
import sys

class ML_Prediction_Client(object):

    def __init__(self):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(host='localhost'))

        self.channel = self.connection.channel()
        self.channel.exchange_declare(exchange='topic_bts', exchange_type='topic')

        result = self.channel.queue_declare(queue='result', exclusive=True)
        self.callback_queue = result.method.queue

        self.channel.basic_consume(
            queue=self.callback_queue,
            on_message_callback=self.on_response,
            auto_ack=True)

    def on_response(self, ch, method, props, body):
        if self.corr_id == props.correlation_id:
            self.response = body

    def send_request(self, dict_mess):
        self.response = None
        self.corr_id = str(dict_mess["index"])
        routing_key = "request.{}.{}.{}".format(dict_mess["station_id"], dict_mess["data_point"], dict_mess["alarm_id"])
        json_mess = {
            "index": float(dict_mess["index"]), 
            "station_id": float(dict_mess["station_id"]), 
            "data_point": float(dict_mess["data_point"]), 
            "alarm_id": float(dict_mess["alarm_id"]),
            "value": float(dict_mess["value"]),
            "threshold": float(dict_mess["threshold"])
        }
        body_mess = json.dumps(json_mess)
        start_time = time.time()
        self.channel.basic_publish(
            exchange='topic_bts',
            routing_key=routing_key,
            properties=pika.BasicProperties(
                reply_to=self.callback_queue,
                correlation_id=self.corr_id,
            ),
            body=body_mess)
        while self.response is None:
            self.connection.process_data_events()
        response_time = time.time() - start_time

        predict_value = json.loads(str(self.response.decode("utf-8")))
        dict_predicted = {
            "SVLR": float(predict_value["SVLR"]), 
            "MVLR": float(predict_value["MVLR"]), 
            "DNNSR": float(predict_value["DNNSR"]), 
            "DNNMR": float(predict_value["DNNMR"])
        }
        svlr_acc =  1 - abs((predict_value["SVLR"] - float(dict_mess["ground_truth"]))/float(dict_mess["ground_truth"]))
        mvlr_acc =  1 - abs((predict_value["MVLR"] - float(dict_mess["ground_truth"]))/float(dict_mess["ground_truth"]))
        dnnsr_acc =  1 - abs((predict_value["DNNSR"] - float(dict_mess["ground_truth"]))/float(dict_mess["ground_truth"]))
        dnnmr_acc =  1 - abs((predict_value["DNNMR"] - float(dict_mess["ground_truth"]))/float(dict_mess["ground_truth"]))
        accuracy = max(svlr_acc, mvlr_acc, dnnsr_acc, dnnmr_acc)*100

        return {"Prediction": dict_predicted, "ResponseTime": response_time, "Accuracy": accuracy}

# Publish message from file
def publish_message(ml_client, file):
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
        ml_response = ml_client.send_request(dict_mess)
        print(ml_response)

    time.sleep(1)
    f.close()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Sent request to Rabbit broker")
    parser.add_argument('--stationid', default=1160629000)
    parser.add_argument('--datapointid', default=121)
    parser.add_argument('--alarmid', default=308)
    parser.add_argument('--file', default="../data/1160629000_121_308_test.csv")
    parser.add_argument('--clientid',help='client id', default=1)
    args = parser.parse_args()

    # Define a client for publising data

    ml_predition_client = ML_Prediction_Client()
    publish_message(ml_predition_client, args.file)
    time.sleep(1)


