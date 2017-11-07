# Ingestion client demo
This sub-project will launch:

* 1 iCOMOT param snsor
* 1 iCOMOT alarm sensor
* 1 mosquitto mqttbroker
* 1 ingestion client

on docker. All results will be published into google BigQuery.

## Dependencices
Docker and Docker Compose should be installed on your machine.
https://docs.docker.com/engine/installation/
https://docs.docker.com/compose/install/

You need a valid google cloud platform account to use BigQuery

## Setup

1. copy `data` folder at the root of this repository here, gitignore has already been set to ignore it
2. go through the build process of the `java` section of the repo to create a working senor jar file
3. copy the sensor jar file into the `sensor` folder
4. make a `src` folder to hold the ingestion client code
5. copy the contents of the `ingestionClient` folder into `src`
6. delete any `node_modules` folder in `src`
7. A `keyfile.json` must also be generated from the google cloud console, For further information read this: https://cloud.google.com/docs/authentication/production#obtaining_and_providing_service_account_credentials_manually
8. copy the keyfile.json into the `src/dataPlugins/bigQuery` folder
9. `config.bigQuery.yml` and `config.ingestionClient.yml` have already been preconfigured, feel free to change them if you have specific requirements
10. from this folder run `$ docker-compose up`

## Results
You can find the results on BigQuery under the tables `alarms` and `params`

## Data
This example uses the bts test data in the `data/bts` folder

