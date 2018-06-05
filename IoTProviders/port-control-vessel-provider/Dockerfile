FROM rdsea/provider-base

COPY . /vessel
WORKDIR /vessel
RUN chmod +x docker-entrypoint.sh
RUN npm install 

ENTRYPOINT ["/ingestion/docker-entrypoint.sh"]