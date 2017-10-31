FROM node:8-alpine

COPY ./src /ingestionClient
WORKDIR ingestionClient
COPY ./config.ingestionClient.yml config.yml
COPY ./config.bigQuery.yml ./dataPlugins/bigQuery/config.yml

RUN npm i 
CMD ["npm", "start"]