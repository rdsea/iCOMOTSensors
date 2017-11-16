# Provisioning utility

This tool aims to be able to provision a simple BTS use case with the help of docker

The tool will allow users to provision the following system:

![Simple BTS](./simple_bts.svg)

with a variable number sensors, brokers and ingestionClients

# Usage
1. Follow the build process of the sensor and put the resulting .jar file in the folder `sensors/`
2. Create a folder `src/` in the folder `ingestionClients/`
3. Copy the source code of the ingestionClient in `ingestionClients/src`
4. Create a configuration file using `config.sample.yml` as a guide
5. Run `$ pipenv run python provision.py <config file location>`
6. Your system should start

## Warning
It is up to the user to make sure that the configuration file is well defined (e.g. topic names match between ingestionClients and sensors)
