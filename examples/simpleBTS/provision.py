from units import brokers, sensors, data, ingestionClients
import sys
import yaml
import os

# read yaml file and set config obj
def load_config(path):
    config = None
    with open(path, 'r') as config_file:
        config = yaml.load(config_file)
    return config

def main(path):
    config = load_config(path)
    # generate docker compose sections
    broker = brokers.provision(config)
    sensor = sensors.provision(config)
    ingestionClient = ingestionClients.provision(config)
    # set data for sensors
    data.provision(config)

    # write docker-compose.yml
    docker_compose = {}
    docker_compose['version'] = '3'
    docker_compose['services'] = {**broker, **sensor, **ingestionClient}
    with open('docker-compose.yml', 'w') as outfile:
        yaml.dump(docker_compose, outfile)

    # start the system
    #os.system('docker-compose up --build')


if __name__ == "__main__":
    if len(sys.argv) <= 1:
        print("usage: provision.py <config file location>")
        sys.exit()
    main(sys.argv[1])
