#!/bin/bash

cd ../../../examples/simpleBTS/
docker-compose down
pipenv run python provision.py ../../tests/utilities/simpleBTSProvision/config.yml
