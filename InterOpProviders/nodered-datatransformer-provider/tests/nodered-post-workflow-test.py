#this program is used to test the upload of a flow into an instance of node-red
#we create list and remove resources.
import requests
import json
import sys
import csv
import time
import concurrent.futures
import argparse
import numpy as np
parser = argparse.ArgumentParser()
parser.add_argument('--nodered_provider', help='URL of the Data Transformer Provider')
parser.add_argument('--workflow_file',help='workflow_file')

args = parser.parse_args()
post_workflow_data =json.load(open(args.workflow_file))
headers = {'content-type': 'application/json'}
def test_upload_workflow(nodered_url):
    workflow_post_response=requests.post(nodered_url+"/flows",data=json.dumps(post_workflow_data),headers=headers)
    print(workflow_post_response.text)
    if (workflow_post_response.text):
        json_workflow_response = json.loads(workflow_post_response.text)
        workflow_id=json_workflow_response['id']
        delete_workflow_response=requests.delete(nodered_url+"/flow/"+workflow_id)
        print(delete_workflow_response)

test_upload_workflow(args.nodered_provider)
