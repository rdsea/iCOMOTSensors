FROM node:8-alpine

COPY ./src /ingestionClient
COPY *.yml /ingestionClient/
COPY config.bigQuery.yml /ingestionClient/dataPlugins/bigQuery/config.yml
COPY keyfile.json /ingestionClient/dataPlugins/bigQuery/keyfile.json
WORKDIR ingestionClient

RUN npm i 
