#!/bin/bash

docker build -t rdsea/$1 .
docker push rdsea/$1
