FROM rdsea/provider-base

COPY . /mqtt
WORKDIR /mqtt
RUN chmod +x docker-entrypoint.sh
RUN npm install 

ENTRYPOINT ["/mqtt/docker-entrypoint.sh"]