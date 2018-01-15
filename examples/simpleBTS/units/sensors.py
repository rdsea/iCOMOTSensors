import yaml
import os, errno
import json

def load_config(path):
    config = None
    with open(path, 'r') as config_file:
        config = yaml.load(config_file)
    return config



def createSensorConfigs(topicSensors):
    sensors = []
    count = 0

    for i in range(topicSensors['nb']):
        config = {}
        config['server'] = topicSensors['broker']
        config['username'] = 'xxx'
        config['password'] = 'xxx'
        config['port'] = 1883
        config['clientId'] = 'sensor_' + topicSensors['topic'] + '_' +str(count)
        config['topic'] = topicSensors['topic']
        sensors.append(config)
        if 'remoteLoggingBroker' in topicSensors:
            remoteLoggingConfig = {}
            remoteLoggingConfig['broker'] = 'tcp://'+topicSensors['remoteLoggingBroker']['host']+':'+str(topicSensors['remoteLoggingBroker']['port'])
            remoteLoggingConfig['topic'] = topicSensors['remoteLoggingBroker']['topic']
            config['remoteLoggingBroker'] = remoteLoggingConfig
            config['remoteLogging'] = True
        count += 1
    return sensors

def write_config_files(sensors):
    try:
        os.makedirs('sensors')
    except OSError as e:
        if e.errno != errno.EEXIST:
            raise
    for sensor in sensors:
        file_name = sensor['clientId']+'.json'
        with open('sensors/'+file_name,'w') as outfile:
            json.dump(sensor, outfile)

def write_compose(sensors):
    services = {}
    for sensor in sensors:
        service = {}
        volumes = [] 
        volumes.append('./sensors/'+sensor['clientId']+'.json'+":/sensor/config.json:")
        volumes.append('./sensors/'+sensor['clientId']+'.csv'+":/sensor/data.csv:")

        service['volumes'] = volumes
        service['image'] = 'rdsea/sensor'
        services[sensor['clientId']] = service
    return services

def provision(config):
    try:
        os.makedirs('sensors')
    except OSError as e:
        if e.errno != errno.EEXIST:
            raise

    sensors = []
    for topicSensors in config['sensors']:
        sensors.extend(createSensorConfigs(topicSensors))
    write_config_files(sensors)
    return write_compose(sensors)

