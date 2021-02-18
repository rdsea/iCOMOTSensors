import json
import requests
import time
import uuid
import pika

template_json = "./input_template.json"
class Qoa_Client(object):

    def __init__(self, client_info, service_info):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(host='localhost'))

        self.channel = self.connection.channel()
        self.channel.exchange_declare(exchange='topic_qoa', exchange_type='topic')

        result = self.channel.queue_declare(queue='qoa_response.{}.{}'.format(client_info["id"], client_info["roles"]), exclusive=True)
        self.callback_queue = result.method.queue

        self.channel.basic_consume(
            queue=self.callback_queue,
            on_message_callback=self.on_response,
            auto_ack=True)
        with open(template_json, 'r') as input_file:
            data=input_file.read()
        self.input_json = json.loads(data)
        for key in client_info:
                self.input_json["client_info"][key] = client_info[key]
        for key in service_info: 
            self.input_json["service_info"][key] = service_info[key]

    def on_response(self, ch, method, props, body):
        if self.corr_id == props.correlation_id:
            self.response = body

    def send_report(self, json_mess):
        print("sending report \n")
        self.response = None
        self.corr_id = str(uuid.uuid4())
        routing_key = "report"
        body_mess = json.dumps(json_mess)

        self.channel.basic_publish(
            exchange='topic_qoa',
            routing_key=routing_key,
            properties=pika.BasicProperties(
                reply_to=self.callback_queue,
                correlation_id=self.corr_id,
            ),
            body=body_mess)
        while self.response is None:
            self.connection.process_data_events()

        predict_value = json.loads(str(self.response.decode("utf-8")))
        return predict_value

    def qoa_report(self, metric, url, prometheus_var=None):
        try:
            for key in metric:
                self.input_json["metric"][key] = metric[key]
            report = {"input":self.input_json}
            
            report["url"] = url
        except Exception as e:
            return "Fail to map report data from {},{},{} to {}, at {}. Details: {}".format(client_info, service_info, metric, self.input_json, time.time(), e)

        try:
            response = self.send_report(report) 
        except Exception as e:
            return "Fail to send the report from {} to {}, at {}. Details: {}".format(report, url, time.time(), e)

        try:
            return json.loads(response.text.encode('utf8'))["result"]
        except Exception as e:
            return "Fail to load the response {} as a json, at {}. Details: {}".format(response, time.time(), e)
    
    def data_quality(self, ground_truth, input_data):
        count = 0
        for i in range(len(ground_truth)):
            try:
                if (int(ground_truth[i]) == int(input_data[i])):
                    count += 1
            except:
                print("wrong data at element {}".format(i))
        data_accuracy = float(count/len(ground_truth))*100
        return data_accuracy