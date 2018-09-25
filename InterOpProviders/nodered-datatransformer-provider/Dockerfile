#FROM rdsea/provider-base
FROM node:8-alpine

COPY . /nodered
WORKDIR /nodered
RUN chmod +x docker-entrypoint.sh
RUN npm install 

ENTRYPOINT ["/nodered/docker-entrypoint.sh"]