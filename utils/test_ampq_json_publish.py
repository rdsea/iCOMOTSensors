#!/usr/bin/env python2
#simple program that can be used to publish json records
#about something to a RabbitMQ
#the records are in a json file and will be sent to a RabbitMQ queue
#we use direct exchange
import pika, os, logging, sys, time
import json
import argparse
parser = argparse.ArgumentParser()
parser.add_argument('--sleep',help='a sleeping time for simulation purpose')
#we can set it by default, e.g. "app_id_UPLOAD"
parser.add_argument('--upload_queuename', help='the name of upload queue')
#we use a direct exchange in rabbitmq so we dont need to declare the name of the exchange
parser.add_argument('--input_data',help='input file name')
#the input data is followed the json format, for example
# [{"type":"video","uri":"http://abc.xyz"}]
#
# Note that we do not store app_id into the sample data file
args = parser.parse_args()
#provide the link of AMQP
amqpLink=os.environ.get('AMQPURL', 'amqp://test:test@localhost')
params = pika.URLParameters(amqpLink)
params.socket_timeout = 5
connection = pika.BlockingConnection(params) # Connect to AMQP, We test with CloudAMQP
channel = connection.channel() # start a channel
channel.queue_declare(queue=args.upload_queuename, durable=False)
#simple load of all requests
upload_data_records = json.load(open(args.input_data))
for req_id in range(len(upload_data_records)):
    message = json.dumps(upload_data_records[req_id])
    print "[uploading_requester] sends: " + message
    #we use the default exchange and route the message to the queuename
    #this essentially is a single queue model (direct queue)
    channel.basic_publish(exchange='',routing_key=args.upload_queuename,
                      body=message)
    #slowdown the sending a bit
    time.sleep(int(args.sleep))
connection.close()
