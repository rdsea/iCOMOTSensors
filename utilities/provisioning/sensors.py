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
    docker_compose = {}
    docker_compose['version'] = '3'
    command_base = ['java', '-jar', './sdsensor-0.0.1-SNAPSHOT-jar-with-dependencies.jar']

    services = {}
    for sensor in sensors:
        service = {}
        command = command_base[:]
        command.append('./'+sensor['clientId']+'.json')
        command.append('./'+sensor['clientId']+'.csv')

        service['command'] = command
        service['build'] = './sensors'
        services[sensor['clientId']] = service
    docker_compose['services'] = services
    with open('docker-compose.sensors.yml', 'w') as outfile:
        yaml.dump(docker_compose, outfile)




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
    write_compose(sensors)


config = load_config('config.sample.yml')
provision(config)
    



