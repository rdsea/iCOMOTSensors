import yaml
import json
import os, errno

# read yaml file and set config obj
def loadConfig(path):
    config = None
    with open(path, 'r') as configFile:
        config = yaml.load(configFile)
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

def createIngestionClientConfigs(ingestionConfigs):
    config = {}
    config['brokers'] = []
    count = 0
    for broker in ingestionConfigs['brokers']:
        brokerConfig = {}
        brokerConfig['username'] = 'xxx'
        brokerConfig['password'] = 'xxx'
        brokerConfig['clientId'] = broker['brokerId']+'_'+str(count) 
        brokerConfig['host'] = broker['brokerId']
        brokerConfig['port'] = 1883
        brokerConfig['topics'] = broker['topics'][:]
        config['brokers'].append(brokerConfig)
        count += 1
    return config
        
def writeConfigFiles(sensors, ingestionClients):
    try:
        os.makedirs('sensors')
        os.makedirs('ingestionClients')
    except OSError as e:
        if e.errno != errno.EEXIST:
            raise
    for sensor in sensors:
        with open('sensors/'+sensor['clientId']+'.json','w') as outfile:
            json.dump(sensor, outfile)
    
    for i in range(len(ingestionClients)):
        with open('ingestionClients/ingestionClient_'+str(i)+'.yml', 'w') as outfile:
            yaml.dump(ingestionClients[i], outfile)


def main(path):
   
    config = loadConfig(path)
    brokers = []
    sensors = []
    ingestionClients = []
    for broker in config['brokers']:
        brokers.append(broker)

    for topicSensors in config['sensors']:
        sensors.extend(createSensorConfigs(topicSensors))
    
    for ingestionConfigs in config['ingestionClients']:
        ingestionClients.append(createIngestionClientConfigs(ingestionConfigs))
    
    writeConfigFiles(sensors, ingestionClients)
    


if __name__ == "__main__":
    main("config.sample.yml")

