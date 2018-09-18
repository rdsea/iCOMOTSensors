FROM rdsea/provider-base

COPY . /mqttprovider
WORKDIR /mqttprovider
RUN chmod +x docker-entrypoint.sh
RUN npm install

ENTRYPOINT ["/mqttprovider/docker-entrypoint.sh"]
