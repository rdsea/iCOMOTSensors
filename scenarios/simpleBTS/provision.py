from units import brokers, sensors, data, ingestionClients
import sys
import argparse
import yaml
import os

# read yaml file and set config obj
def load_config(path):
    config = None
    with open(path, 'r') as config_file:
        config = yaml.load(config_file,Loader=yaml.FullLoader)
    return config

def main(path,dryrun):
    config = load_config(path)
    # generate docker compose sections
    broker = brokers.provision(config)
    sensor = sensors.provision(config)
    ingestionClient = ingestionClients.provision(config)
    # set data for sensors
    data.provision(config)
    '''
    the assumption is to create a docker compose file
    one can also think about Kubernetes
    '''
    docker_compose = {}
    docker_compose['version'] = '3'
    docker_compose['services'] = {**broker, **sensor, **ingestionClient}
    with open('docker-compose.yml', 'w') as outfile:
        yaml.dump(docker_compose, outfile)

    '''
    No deployment in dryrun mode
    '''
    if (dryrun):
        '''
        a simple way to start
        '''
        os.system('docker-compose up')


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--file', help="the configuration file for provisioning")
    parser.add_argument('--dryrun', help="dryrun mode",action='store_true')
    parser.set_defaults(dryrun=False)
    args = parser.parse_args()
    main(args.file,args.dryrun)
