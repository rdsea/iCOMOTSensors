# This simple program is a utility used to conver json data (of valencia port)
# to csv. It is used for data preparation for demo purpose only.
# Due to project condition, we dont put the data here
#The assumption of the formalt is
#{"valenciaPortData":{
#            "typeofdata":[
#            {
#           several name:value
#            },
#
#            ]
#            }
#}
#TODO: optimizing for large file
import json
import sys
import csv
import argparse
parser = argparse.ArgumentParser()
parser.add_argument('--input_json_file', help='Input JSON file')
parser.add_argument('--output_csv_file', help='output csv file')
parser.add_argument('--name_typeofdata', help='type of data')
parser.add_argument('--root_name',default='valenciaPortData',help='root of the json')
args = parser.parse_args()
input_data = json.load(open(args.input_json_file))
print(json.dumps(input_data))
entries =input_data[args.root_name][args.name_typeofdata]
with open(args.output_csv_file, 'w',newline='',encoding='utf-8') as csvfile:
    fieldnames = entries[0].keys()
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(entries)
    #for i in range(len(entries)):
    #    print(entries[i])
    #    keys =entries[i].keys()
