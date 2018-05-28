FROM rdsea/provider-base

COPY . /ingestion
WORKDIR /ingestion
RUN chmod +x docker-entrypoint.sh
RUN npm install 

ENTRYPOINT ["/ingestion/docker-entrypoint.sh"]