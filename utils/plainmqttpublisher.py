#!/usr/bin/env python2
#encoding: UTF-8

# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

#use some basic mqtt code from mqtt examples.

import sys, os, logging,json
import paho.mqtt.client as paho
import urlparse
import time
import csv
import json
#--------------- network server can be selected based on zone or pre-defined
# it is important to have fault tolerance 
# simulating with mqtt from cloudmqtt
#mqtt is used to connect to network server
#amqp can also be used to connect to network server
def on_connect(mosq, obj, rc):
    print("rc: " + str(rc))

def on_publish(mosq, obj, mid):
    print("mid: " + str(mid))

mqttc = paho.Client()
# Assign event callbacks
mqttc.on_connect = on_connect
mqttc.on_publish = on_publish
 
url_str = sys.argv[2]
url = urlparse.urlparse(url_str)
print url.username, url.password
mqttc.username_pw_set(url.username, url.password)
print url.hostname, url.port
mqttc.connect(url.hostname, url.port)
uplink_topic =sys.argv[1]
#start sending data
with open(sys.argv[3], 'rb') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
         body =json.dumps(row)
	 message = {
	    'station_id':str(row['station_id']),
            'parameter_id':int(row['parameter_id']),
            'alarm_id':int(row['alarm_id']),
            'start_time':str(row['start_time']),
	    'end_time':str(row['end_time']),
	    'value':float(row['value']),
	    'threshold':float(row['threshold'])	
	 }
	 print  message
         #channel.queue_declare(queue='mobifonetest') # Declare a queue
         # create a function which is called on incoming messages
         mqttc.publish(uplink_topic, json.dumps(message))
         time.sleep(5)
