FROM rdsea/provider-base

COPY . /bigqueryiotdaas
WORKDIR /bigqueryiotdaas
RUN chmod +x docker-entrypoint.sh
RUN npm install

ENTRYPOINT ["/bigqueryiotdaas/docker-entrypoint.sh"]
