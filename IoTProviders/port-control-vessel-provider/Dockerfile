FROM rdsea/provider-base

COPY . /vessel
WORKDIR /vessel
RUN chmod +x docker-entrypoint.sh
RUN npm install 

ENTRYPOINT ["/vessel/docker-entrypoint.sh"]