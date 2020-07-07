#FROM rdsea/provider-base
FROM node:alpine3.12
COPY . /ingestion
WORKDIR /ingestion
RUN chmod +x docker-entrypoint.sh
RUN npm install
ENV MONGODB_URL "mongodb://URL"
ENTRYPOINT ["/ingestion/docker-entrypoint.sh"]
