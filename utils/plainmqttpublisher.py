# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

#use some basic mqtt code from mqtt examples.

'''
This proram reads CVS file of BTS and sends to MQTT
'''
import sys, os, logging
import paho.mqtt.client as paho
import time
import csv
import json
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('-mc', '--mqttconf', help='mqtt configuration. see sample configuration')
parser.add_argument('-s', '--sleep', default=5 ,help='sleep in seconds')
parser.add_argument('--inputfile', help='BTS CVS inputfile')
args = parser.parse_args()
#--------------- network server can be selected based on zone or pre-defined
# it is important to have fault tolerance
# simulating with mqtt from cloudmqtt
#mqtt is used to connect to network server
#amqp can also be used to connect to network server
def on_connect(mosq, obj, rc):
	print("rc: " + str(rc))

def on_publish(mosq, obj, mid):
	print("mid: " + str(mid))

with open(args.mqttconf,"r") as mc_file:
	mqttconfig =json.load(mc_file)

mqttc = paho.Client()
# Set call back
mqttc.on_connect = on_connect
mqttc.on_publish = on_publish

mqttc.username_pw_set(mqttconfig['username'], mqttconfig['password'])
mqttc.connect(mqttconfig['host'], mqttconfig['port'])
#start sending data
with open(args.inputfile, 'r') as csvfile:
	reader = csv.DictReader(csvfile)
	for row in reader:
		body =json.dumps(row)
		message={
		'station_id':str(row['station_id']),
        'parameter_id':int(row['parameter_id']),
        'alarm_id':int(row['alarm_id']),
        'start_time':str(row['start_time']),
	    'end_time':str(row['end_time']),
	    'value':float(row['value']),
	    'threshold':float(row['threshold'])
	 	}
		print(message)
		mqttc.publish(mqttconfig['topic'], json.dumps(message))
		time.sleep(int(args.sleep))
