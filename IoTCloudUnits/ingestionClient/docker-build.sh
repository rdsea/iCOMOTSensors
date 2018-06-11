#!/bin/bash

docker build -t rdsea/ingestion .
docker push rdsea/ingestion