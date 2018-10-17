#this program is used to test a resource lifecycle.
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
parser.add_argument('--datatransformer_provider', help='URL of the Data Transformer Provider')
#parser.add_argument('--resource_type', help='Type of resource')


args = parser.parse_args()
base_url=args.datatransformer_provider
create_resource=base_url+"/"
delete_resource=base_url
list_resource=base_url
list_all_resource=base_url+"/list"

#post_data ={"functionname":args.resource_type}
#headers = {'content-type': 'application/json'}

def single_delete_test(datatransformerId):

    delete_data = delete_resource+"/"+datatransformerId
    delete_response=requests.delete(delete_data)
    print(delete_response.text)

def single_query_test(datatransformerId):
    query_data = list_resource+"/"+datatransformerId
    query_response=requests.get(query_data)
    if (query_response.text != None):
        print(query_response.text)
        json_instance =json.loads(query_response.text)
        if ((json_instance == None) or (len(json_instance)==0)):
            return
        if (json_instance[0]['datatransformerId']==datatransformerId):
            print("BIG PROBLEM")

##prepare for result file
all_instance_response=requests.get(list_all_resource)
list_instances =json.loads(all_instance_response.text)
for i in range(len(list_instances)):
    single_delete_test(list_instances[i]['datatransformerId'])
    single_query_test(list_instances[i]['datatransformerId'])

    #with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
    #    for i in range(max_workers):
    #        future = executor.submit(single_test,datatransformerId)
