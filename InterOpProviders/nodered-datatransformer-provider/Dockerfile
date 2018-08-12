FROM rdsea/provider-base

COPY . /nodered
WORKDIR /nodered
RUN chmod +x docker-entrypoint.sh
RUN npm install 

ENTRYPOINT ["/nodered/docker-entrypoint.sh"]