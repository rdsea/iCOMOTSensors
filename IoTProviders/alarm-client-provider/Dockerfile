FROM rdsea/provider-base

COPY . /alarmclient
WORKDIR /alarmclient
RUN chmod +x docker-entrypoint.sh
RUN npm install 

ENTRYPOINT ["/alarmclient/docker-entrypoint.sh"]