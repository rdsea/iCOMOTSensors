FROM rdsea/provider-base

COPY . /sensorprovider
WORKDIR /sensorprovider
RUN chmod +x docker-entrypoint.sh
RUN npm install

ENTRYPOINT ["/sensorprovider/docker-entrypoint.sh"]
