#this program is used to test a resource lifecycle.
#we create list and remove resources.
import requests
import json
import sys
import csv
import time
import validators
import concurrent.futures
import argparse
import numpy as np
from chai import Chai
parser = argparse.ArgumentParser()
parser.add_argument('--datatransformer_provider', help='URL of the Data Transformer Provider')
#parser.add_argument('--resource_type', help='Type of resource')
parser.add_argument('--num_test', help='Number of tests')
parser.add_argument('--num_client',help='Number of concurrent clients')
parser.add_argument('--test_output', help='output csv file')
parser.add_argument('--workflow_file',help='workflow_file')
parser.add_argument('--dry_run',help='Simple dry run mode')
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
post_workflow_data =json.load(open(args.workflow_file))
headers = {'content-type': 'application/json'}
def test_upload_workflow(nodered_url):
    print("Start to test the instance ",nodered_url)
    workflow_post_response=requests.post(nodered_url+"/flows",data=json.dumps(post_workflow_data),headers=headers)
    print(workflow_post_response.text)
    json_workflow_response = json.loads(workflow_post_response.text)
    try:
        Chai.expect(json_workflow_response.id)
        workflow_id=json_workflow_response['id']
        Chai.assert_equals( None, workflow_id)
        delete_workflow_response=requests.delete(nodered_url+"/flow/"+workflow_id)
        print(delete_workflow_response.text)
    except:
        print("Error in get workflow id ")
    print("End the test of the workflow upload for the transformer instance")
def single_test(max_workers,num_test):
    num_failed = 0
    total_time = 0
    ping_time =0
    ping_counter=0
    creation_time = 0
    creation_counter = 0
    list_time = 0
    list_counter =0
    upload_workflow_time =0
    upload_workflow_counter =0
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
            #wait until we can get the service url of the datatransformerId
            still_wait = True
            datatransformer_url=""
            print(get_data)
            start = time.time()
            while still_wait:
                list_response=requests.get(get_data)
                json_list_response = json.loads(list_response.text)
                datatransformer_url=json_list_response[0]['url']
                if (validators.url(datatransformer_url)):
                    still_wait=False
                else:
                    #sleep 1 seconds
                    time.sleep(1)
            stop = time.time()
            list_time =list_time+stop -start
            list_counter = list_counter+1
            #wait until you an get the ip address
            test_upload_workflow(datatransformer_url)
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
    fieldnames = ["nrclient","serviceping","creationtime","workflowtesttime","deletiontime"]
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
