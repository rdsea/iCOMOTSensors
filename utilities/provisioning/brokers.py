import yaml

# read yaml file and set config obj
def load_config(path):
    config = None
    with open(path, 'r') as config_file:
        config = yaml.load(config_file)
    return config

def write_compose(docker_compose):
    with open('docker-compose.brokers.yml', 'w') as outfile:
        yaml.dump(docker_compose, outfile)

def provision(config):
    docker_compose = {} 
    brokers = config['brokers']
    docker_compose['version'] = '3'

    services = {}
    for broker in brokers:
        brokerService = {}
        brokerService['image'] = 'eclipse-mosquitto'
        services[broker] = brokerService
    docker_compose['services'] = services
    write_compose(docker_compose)
   



