#FROM rdsea/provider-base
FROM node:8-alpine

COPY . /noderedprovider
WORKDIR /noderedprovider
RUN chmod +x docker-entrypoint.sh
RUN npm install

ENV NODE_ENV "production"
ENTRYPOINT ["/noderedprovider/docker-entrypoint.sh"]
