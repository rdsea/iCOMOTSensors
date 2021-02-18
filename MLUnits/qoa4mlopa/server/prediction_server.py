import numpy as np
import tflite_runtime.interpreter as tflite
import argparse
import time
import json
import pika
import sys
sys.path.append("../probeslib")
from probes import Qoa_Client

client_info = {"id": "aaltosea1",
        "roles": "ml_provider"}
service_info = {"id": "request", 
        "machinetypes": "small", 
        "metric": ["Accuracy", "ResponseTime", "DataAccuracy"]}
metric = {"Accuracy": 100.0,
        "ResponseTime": 0.0}
ground_truth = [1160629000, 121, 308]


flag = True

class ML_Prediction_Server(object):
    def __init__(self, qoa_url):
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
        self.channel = self.connection.channel()

        self.channel.exchange_declare(exchange='topic_bts', exchange_type='topic')

        self.result = self.channel.queue_declare(queue='rpc_queue', exclusive=True)
        self.queue_name = self.result.method.queue
        self.channel.queue_bind(exchange='topic_bts', queue=self.queue_name, routing_key="request.#")
        self.qoa_client = Qoa_Client(client_info,service_info)
        self.qoa_url = qoa_url

        

    def on_request(self, ch, method, props, body):
        start_time = time.time()
        predict_value = json.loads(str(body.decode("utf-8")))
        index = float(predict_value["index"]) 
        station_id = float(predict_value["station_id"])
        data_point = float(predict_value["data_point"])
        alarm_id = float(predict_value["alarm_id"])
        value = float(predict_value["value"])
        threshold = float(predict_value["threshold"])
        svlr = self.single_var_LR(index)
        mvlr = self.multi_var_LR(index, value, threshold)
        dnnsr = self.DNN_single_regression(index)
        dnnmr = self.DNN_multi_regression(index, value, threshold)

        data_js = {
            "SVLR": float(svlr), 
            "MVLR": float(mvlr), 
            "DNNSR": float(dnnsr), 
            "DNNMR": float(dnnmr)
        }
        print("Result: {}".format(data_js))
        response = json.dumps(data_js)

        ch.basic_publish(exchange='',
                        routing_key=props.reply_to,
                        properties=pika.BasicProperties(correlation_id = \
                                                            props.correlation_id),
                        body=str(response))
        response_time = time.time()-start_time
        input_data = [float(predict_value["station_id"]), float(predict_value["data_point"]), float(predict_value["alarm_id"])]
        data_accuracy = self.qoa_client.data_quality(ground_truth,input_data)
        metric["ResponseTime"] = response_time
        metric["DataAccuracy"] = data_accuracy
        qoa_response = self.qoa_client.qoa_report(metric, self.qoa_url)
        ch.basic_ack(delivery_tag=method.delivery_tag)
    def run(self):
        self.channel.basic_qos(prefetch_count=1)
        self.channel.basic_consume(queue='rpc_queue', on_message_callback=self.on_request)
        self.channel.start_consuming()

    def single_var_LR(self, index):
        interpreter = tflite.Interpreter("../exported_models/tflite_model/single_var_LR.tflite")
        interpreter.allocate_tensors()
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()
        input_var = np.array([index], dtype='f')
        interpreter.set_tensor(input_details[0]['index'], input_var)
        interpreter.invoke()
        y = interpreter.get_tensor(output_details[0]['index']) 
        return y

    def multi_var_LR(self, indext, value, thresdhold):
        interpreter = tflite.Interpreter("../exported_models/tflite_model/multi_var_LR.tflite")
        interpreter.allocate_tensors()
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()
        input_var = np.array([[indext, value, thresdhold]], dtype='f')
        interpreter.set_tensor(input_details[0]['index'], input_var)
        interpreter.invoke()
        y = interpreter.get_tensor(output_details[0]['index']) 
        return y

    def DNN_single_regression(self, index):
        interpreter = tflite.Interpreter("../exported_models/tflite_model/DNN_single_regression.tflite")
        interpreter.allocate_tensors()
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()
        input_var = np.array([index], dtype='f')
        interpreter.set_tensor(input_details[0]['index'], input_var)
        interpreter.invoke()
        y = interpreter.get_tensor(output_details[0]['index']) 
        return y

    def DNN_multi_regression(self, indext, value, thresdhold):
        interpreter = tflite.Interpreter("../exported_models/tflite_model/DNN_multi_regression.tflite")
        interpreter.allocate_tensors()
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()
        input_var = np.array([[indext, value, thresdhold]], dtype='f')
        interpreter.set_tensor(input_details[0]['index'], input_var)
        interpreter.invoke()
        y = interpreter.get_tensor(output_details[0]['index']) 
        return y




if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Predict on edge device")
    parser.add_argument('--url', help='qoa4ml OPA service', default='http://0.0.0.0:8181/v1/data/qoa4ml/bts/alarm/violation')
    args = parser.parse_args()

    
    ml_prediction_server = ML_Prediction_Server(args.url)
    ml_prediction_server.run()
    
    

    # client.subscribe("alarm/finish")
    print("Start Scribing")
    while (flag):
        print("waiting")
        time.sleep(10)