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
parser.add_argument('--num_test', help='Number of tests')
parser.add_argument('--num_client',help='Number of concurrent clients')
parser.add_argument('--test_output', help='output csv file')
parser.add_argument('--dry_run',help='Dry run')

args = parser.parse_args()
num_test =int(args.num_test)
num_client =int(args.num_client)
dry_run =False
if (args.dry_run =="true"):
    dry_run =True
#route_host="35.231.254.203"
base_url=args.datatransformer_provider
create_resource=base_url+"/"
delete_resource=base_url
list_resource=base_url
#post_data ={"functionname":args.resource_type}
#headers = {'content-type': 'application/json'}

def single_test(max_workers,num_test):
    num_failed = 0
    total_time = 0
    ping_time =0
    ping_counter=0
    creation_time = 0
    creation_counter = 0
    list_time = 0
    list_counter =0
    deletion_time =0
    deletion_counter =0
    for i in range(num_test):
        if (dry_run):
            print(create_resource)
            print(delete_resource)
            print(list_resource)
        else:
            start = time.time()
            ping_response=requests.get(base_url)
            stop = time.time()
            ping_time = ping_time +stop -start
            ping_counter = ping_counter +1
            start = time.time()
            create_response=requests.post(create_resource)
            stop = time.time()
            creation_time =creation_time + stop -start
            creation_counter =creation_counter+1
            json_response = json.loads(create_response.text)
            datatransformerId=json_response['datatransformerId']
            get_data =list_resource+"/"+datatransformerId
            print(get_data)
            start = time.time()
            list_response=requests.get(get_data)
            stop = time.time()
            list_time =list_time+stop -start
            list_counter = list_counter+1
            print(list_response.text)
            delete_data = delete_resource+"/"+datatransformerId
            print(delete_data)
            start = time.time()
            delete_response=requests.delete(delete_data)
            stop = time.time()
            deletion_time =deletion_time + stop -start
            deletion_counter = deletion_counter +1
            print(delete_response.text)
    #print(creation_time,creation_counter,list_time,list_counter,deletion_time,deletion_counter)
    return np.array([ping_time/ping_counter,creation_time/creation_counter,list_time/list_counter,deletion_time/deletion_counter])

##prepare for result file
with open(args.test_output, 'w',newline='',encoding='utf-8') as csvfile:
    fieldnames = ["nrclient","serviceping","creationtime","listtime","deletiontime"]
    writer = csv.writer(csvfile)
    writer.writerow(fieldnames)
    for max_workers in range(1, num_client, 2):
        print("Test with ", max_workers)
        results=[]
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            for i in range(max_workers):
                future = executor.submit(single_test,max_workers,num_test)
                results.append(future.result())
                print(results)
        #print(np.average(results, axis=0))
        writer.writerow(np.insert(np.average(results, axis=0),0,max_workers))
