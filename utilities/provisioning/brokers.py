import yaml

def get_next_port():
    port = 9001
    while(True):
        yield port
        port += 1

# read yaml file and set config obj
def load_config(path):
    config = None
    with open(path, 'r') as config_file:
        config = yaml.load(config_file)
    return config

# returns the docker compose services
def provision(config):
    brokers = config['brokers']
    services = {}
    g = get_next_port()
    for broker in brokers:
        ports = []
        ports.append(str(next(g))+':1883')
        brokerService = {}
        brokerService['image'] = 'eclipse-mosquitto'
        brokerService['ports'] = ports
        services[broker] = brokerService
       
    return services
