import json
import pika
# import threading

class Sub_Queue(object):
    def __init__(self, host_object, broker_info, queue_info):
        self.host_object = host_object  
        self.exchange_name = queue_info["exchange_name"]
        self.exchange_type = queue_info["exchange_type"]
        self.roles = queue_info["roles"]
        self.in_routing_key = queue_info["in_routing_key"]
        self.out_routing_key = queue_info["out_routing_key"]

        # Connect to RabbitMQ host
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=broker_info["url"]))

        # Create a channel
        self.channel = self.connection.channel()

        # Init an Exchange 
        self.channel.exchange_declare(exchange=self.exchange_name, exchange_type=self.exchange_type)
        

        if (self.roles == "server"):
            # Declare a queue to receive prediction response
            self.queue = self.channel.queue_declare(queue=queue_info["in_queue"], exclusive=True)
            self.queue_name = self.queue.method.queue
            # Binding the exchange to the queue with specific routing
            self.channel.queue_bind(exchange=self.exchange_name, queue=self.queue_name, routing_key=self.in_routing_key)
            
        elif (self.roles == "client"):
            # Declare a queue to receive prediction response
            self.queue = self.channel.queue_declare(queue=queue_info["out_queue"], exclusive=True)
            self.queue_name = self.queue.method.queue
            # Binding the exchange to the queue with specific routing
            self.channel.queue_bind(exchange=self.exchange_name, queue=self.queue_name, routing_key=self.out_routing_key)
        
              

    def on_request(self, ch, method, props, body):
        # Process the data on request
        self.host_object.message_processing(ch, method, props, body)

    def start(self):
        # Start rabbit MQ
        self.channel.basic_qos(prefetch_count=1)
        self.channel.basic_consume(queue=self.queue_name,on_message_callback=self.on_request,auto_ack=True)
        self.channel.start_consuming()
        # consume_thread = threading.Thread(target=self.channel.start_consuming)
        # consume_thread.start()

    def stop(self):
        self.channel.close()

    def get_queue(self):
        return self.queue.method.queue