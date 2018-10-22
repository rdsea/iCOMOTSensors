import requests
import json
import sys
import time
import argparse
import numpy as np
parser = argparse.ArgumentParser()
parser.add_argument('--datatransformer_provider', help='URL of the Data Transformer Provider')
#parser.add_argument('--resource_type', help='Type of resource')
parser.add_argument('--num_test', help='Number of tests')

args = parser.parse_args()
num_test =int(args.num_test)
payload = {"tenantId": "valenciaportcontrol",
           "description": "this is a special instance for valencia port",
           "name":"truckprocessor"
           }
headers = {
    'Content-Type': "application/json",
    'Cache-Control': "no-cache",
    }

for i in range(num_test):
    payload['name']="truckprocessor"+str(i)
    response = requests.request("POST", args.datatransformer_provider, data=json.dumps(payload), headers=headers)
    print(response.text)
