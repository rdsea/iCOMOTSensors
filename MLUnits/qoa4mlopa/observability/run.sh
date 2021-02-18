#!/bin/bash
docker_cmd="docker run -p 8181:8181 openpolicyagent/opa:latest run --server --set=decision_logs.console=true"
$docker_cmd &

sleep 10

curl --location --request PUT 'localhost:8181/v1/policies/bts' -H 'Content-Type: text/plain' --data-binary @bts.rego

curl --location --request PUT 'localhost:8181/v1/data/bts/contract' -H 'Content-Type: application/json' -d @contract.json

docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

docker run -p 9090:9090 -v `pwd`/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus
