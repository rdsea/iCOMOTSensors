FROM rdsea/provider-base

COPY . /bigquery
WORKDIR /bigquery
RUN chmod +x docker-entrypoint.sh
RUN npm install 

ENTRYPOINT ["/bigquery/docker-entrypoint.sh"]