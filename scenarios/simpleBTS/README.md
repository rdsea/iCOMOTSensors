# Provisioning utility

This tool aims to be able to setup and provision a simple BTS use case with the help of docker

The example will allow users to setup and provision the following system:

![Simple BTS](./simple_bts.svg)

with a variable number sensors, brokers and ingestionClients

# Dependencies
This example requires python3. Please make sure python3 is installed 

You will also need to install pip(3) and pipenv, pipenv is a tool that manages python dependencies in the way that npm would for node js. The python dependencies in this project
can be viewed in the Pipfile

# Usage
All software components are located in IoTCloudUnits folder, and all the build steps are documented in the 
corresponding projects. Make sure you have an understanding of how each unit behaves and functions.

1. Follow the build process of the sensor and put the resulting .jar file in the folder `sensors/`
2. Create the folders `ingestionClients/` and `sensors/`
3. You will need a keyfile.json (google json credentials file) in the directory `ingestionClients`

## Warning
It is up to the user to make sure that the configuration file is well defined (e.g. topic names match between ingestionClients and sensors)

# Logs
If you want to retrieve log information, it is recommended to use telegraf, which supports many types of output as plugins. There is a sample configuration provided in the test utilities.

All log files that are generated are mounted in the /tmp directory. You can find out the exact location by looking at the generate docker-compose.yml file
