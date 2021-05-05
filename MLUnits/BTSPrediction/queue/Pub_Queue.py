import json
import pika

class Pub_Queue(object):
    def __init__(self, host_object, broker_info, queue_info):
        self.host_object = host_object  
        self.exchange_name = queue_info["exchange_name"]
        self.exchange_type = queue_info["exchange_type"]
        self.roles = queue_info["roles"]

        # Connect to RabbitMQ host
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=broker_info["url"]))

        # Create a channel
        self.channel = self.connection.channel()
        
        # Init an Exchange 
        self.channel.exchange_declare(exchange=self.exchange_name, exchange_type=self.exchange_type)
        # Declare a queue to receive prediction response
        

    def send_data(self, routing_key, body_mess, corr_id):
        if (self.roles == "client"):
            rep_to = self.host_object.sub_queue.get_queue()
            self.sub_properties = pika.BasicProperties(reply_to=rep_to,correlation_id=corr_id)
            self.channel.basic_publish(exchange=self.exchange_name,routing_key=routing_key,properties=self.sub_properties,body=body_mess)
        else:
            self.sub_properties = pika.BasicProperties(correlation_id=corr_id)
            self.channel.basic_publish(exchange='',routing_key=routing_key,properties=self.sub_properties,body=body_mess)
        
