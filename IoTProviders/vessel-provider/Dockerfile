FROM rdsea/provider-base

COPY . /vessel
WORKDIR /vessel
RUN chmod +x docker-entrypoint.sh
RUN npm install 

ENV PCS_URL="http://pcs:9999"
ENTRYPOINT ["/vessel/docker-entrypoint.sh"]