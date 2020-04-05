FROM rdsea/provider-base

COPY . /firewall
WORKDIR /firewall
RUN chmod +x docker-entrypoint.sh
RUN npm install
ENV MONGODB_URL "mongodb://iotcloudexamples:....:27017/sinc?ssl=true&replicaSet=IoTCloudExamples-shard-0&authSource=admin"

EXPOSE 3008
ENTRYPOINT ["/firewall/docker-entrypoint.sh"]
