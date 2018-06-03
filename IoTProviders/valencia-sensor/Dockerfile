FROM rdsea/provider-base

COPY . /sensor
WORKDIR /sensor
RUN chmod +x docker-entrypoint.sh
RUN npm install 

ENTRYPOINT ["/sensor/docker-entrypoint.sh"]