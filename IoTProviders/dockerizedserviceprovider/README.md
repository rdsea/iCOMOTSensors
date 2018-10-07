# Dockerized Service Provider
This provider supports running lightweight microservices provided by docker images for IoT/Edge server. The idea is that for IoT/Edge applications some lightweighted Dockerized components/services must be  started and stopped on-demand. Furthermore, such services must be exposed to the outside world.
This provider supports the management of such Dockerized components/services.

## Setup

MongoDB is needed and specified through

$export MONGODB_URL=

## Usage

### Check availability

$curl -X GET http://localhost:3009/docker

### List running dockers

curl -X GET http://localhost:3009/docker/list

### Running a docker

For example the following command is used to run a docker image

```
curl -X POST \
  http://localhost:3009/docker \
  -H 'Content-Type: application/json' \
  -d '{
        "image": "nodered/node-red-docker",
        "ports": [
            13000,
            13001
        ],
        "environment": [
            {
                "name": "ENV_NAME_JUST_TEST",
                "value": "variable_test"
            }
        ],
        "files": [
            {
                "name": "test_name",
                "path": "/tmp/",
                "body": "the content of the file here"
            }
        ]
}'

```
