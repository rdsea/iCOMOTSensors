import json
import pika

class Queue_Handler(object):
    def __init__(self, ML_server):
        # Init the connection and prediction server
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
        self.channel = self.connection.channel()

        self.channel.exchange_declare(exchange='topic_bts', exchange_type='topic')

        self.result = self.channel.queue_declare(queue='rpc_queue', exclusive=True)
        self.queue_name = self.result.method.queue
        self.channel.queue_bind(exchange='topic_bts', queue=self.queue_name, routing_key="request.#")
        self.ML_server = ML_server

    def on_request(self, ch, method, props, body):
        # Process the data on request
        # Parse data
        predict_value = json.loads(str(body.decode("utf-8")))
        index = float(predict_value["index"]) 
        station_id = float(predict_value["station_id"])
        data_point = float(predict_value["data_point"])
        alarm_id = float(predict_value["alarm_id"])
        value = float(predict_value["value"])
        threshold = float(predict_value["threshold"])

        # Call back the ML prediction server for making prediction
        response = self.ML_server.ML_prediction(index, value, threshold)

        # Response the request
        ch.basic_publish(exchange='',
                        routing_key=props.reply_to,
                        properties=pika.BasicProperties(correlation_id = \
                                                            props.correlation_id),
                        body=str(response))
        input_data = [float(predict_value["station_id"]), float(predict_value["data_point"]), float(predict_value["alarm_id"])]
        ch.basic_ack(delivery_tag=method.delivery_tag)

    def run(self):
        # Start rabbit MQ
        self.channel.basic_qos(prefetch_count=1)
        self.channel.basic_consume(queue='rpc_queue', on_message_callback=self.on_request)
        self.channel.start_consuming()