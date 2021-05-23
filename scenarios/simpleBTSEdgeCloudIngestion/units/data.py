import yaml
import os, errno
import json
import csv

def load_config(path):
    config = None
    with open(path, 'r') as config_file:
        config = yaml.load(config_file,Loader=yaml.FullLoader)
    return config

def read_csv(path, sensor_id_field):
    sensor_data = {}
    with open(path, 'r') as csvFile:
        reader = csv.DictReader(csvFile)
        for row in reader:
            if row[sensor_id_field] not in sensor_data:
                sensor_data[row[sensor_id_field]] = []
            sensor_data[row[sensor_id_field]].append(row)
        return sensor_data

def write_data(data, sensor_names):
    fieldnames = list(data[list(data.keys())[0]][0].keys())

    sensor_ids = list(data.keys())
    for i in range(len(sensor_names)):
        with open('sensors/'+sensor_names[i]+'.csv', 'w') as outfile:
            writer = csv.DictWriter(outfile, fieldnames)
            writer.writeheader()
            for row in data[sensor_ids[i]]: writer.writerow(row)

def provision(config):
    data = read_csv(config['data']['path'], config['data']['sensorId'])
    sensor_count = 0
    sensor_names = []
    for sensor_config in config['sensors']:
        count = 0
        for i in range(sensor_config['nb']):
            sensor_names.append('sensor_' + sensor_config['topic'] + '_' +str(count))
            count += 1
    write_data(data, sensor_names)


#config = load_config('config.sample.yml')
#provision(config)
