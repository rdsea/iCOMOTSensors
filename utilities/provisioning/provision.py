import yaml
import json

BROKER_ID = 'mqtt'
SENSOR_ID = 'sensor'
INGESTION_ID = 'ingestion'

BROKER_COUNT = 0
SENSOR_COUNT = 0
INGESTION_COUNT = 0

def getNextSensor():
    global SENSOR_COUNT
    next = SENSOR_COUNT
    SENSOR_COUNT += 1
    return next

def getNextBroker():
    global BROKER_COUNT
    next = BROKER_COUNT
    BROKER_COUNT += 1
    return next

def getNextIngestion():
    global INGESTION_COUNT
    next = INGESTION_COUNT
    INGESTION_COUNT += 1
    return next

# read yaml file and set config obj
def loadConfig(path):
    config = None
    with open(path, 'r') as configFile:
        config = yaml.load(configFile)
    return config


def createSensorConfigs(brokerId, count):
    sensors = []
    
    for i in range(count):
        config = {}
        config['server'] = brokerId
        config['username'] = 'xxx'
        config['password'] = 'xxx'
        config['port'] = 1883
        config['clientId'] = SENSOR_ID +'_'+ str(getNextSensor())
        config['topic'] = 'test/'+config['clientId']
        sensors.append(config)
    return sensors

def createIngestionClientConfigs(sensors, count):
    pass    

def main(path):
    config = loadConfig(path)
    brokers = []
    sensors = []
    ingestionClients = []
    for broker in config['brokers']:
        brokerId = BROKER_ID+'_'+str(getNextBroker())
        brokers.append(brokerId)
        sensors.extend((createSensorConfigs(brokerId, broker['sensors']['nb'])))





if __name__ == "__main__":
    main("config.sample.yml")

