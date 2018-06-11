FROM rdsea/provider-base

COPY . /firewall
WORKDIR /firewall
RUN chmod +x docker-entrypoint.sh
RUN npm install 

EXPOSE 3008
ENTRYPOINT ["/firewall/docker-entrypoint.sh"]