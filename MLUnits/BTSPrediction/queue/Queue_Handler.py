import json
import pika

class Queue_Handler(object):
    def __init__(self, host_object, amqp_host, exchange_name, exchange_type,queue_name, object_type):
        # Connect to RabbitMQ host
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=amqp_host))
        # Create a channel
        self.channel = self.connection.channel()
        self.exchange_name=exchange_name
        # Init an Exchange 
        self.channel.exchange_declare(exchange=exchange_name, exchange_type=exchange_type)
        # Declare a queue to receive prediction response
        self.queue = self.channel.queue_declare(queue=queue_name, exclusive=True)
        self.queue_name = self.queue.method.queue
        self.object_type = object_type

        if (self.object_type == 'server'):
        # Binding the exchange to the queue with specific routing
            self.channel.queue_bind(exchange=exchange_name, queue=self.queue_name, routing_key="request.#")
            
        elif (self.object_type == 'client'):
            # Init the callback queue and callback function
            self.channel.basic_consume(
                queue=self.queue_name,
                on_message_callback=self.on_request,
                auto_ack=True)
        self.host_object = host_object

    def on_request(self, ch, method, props, body):
        # Process the data on request
        self.host_object.message_processing(ch, method, props, body)

    def send_data(self, routing_key, body_mess, corr_id):
        self.channel.basic_publish(
            exchange=self.exchange_name,
            routing_key=routing_key,
            properties=pika.BasicProperties(
                reply_to=self.queue_name,
                correlation_id=corr_id,
            ),
            body=body_mess)
    def process_data_events(self):
        self.connection.process_data_events()

    def run(self):
        # Start rabbit MQ
        if (self.object_type == 'server'):
            self.channel.basic_qos(prefetch_count=1)
            self.channel.basic_consume(queue=self.queue_name, on_message_callback=self.on_request)
            self.channel.start_consuming()