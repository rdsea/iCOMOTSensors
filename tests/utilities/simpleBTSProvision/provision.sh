#!/bin/bash

cd ../../../examples/simpleBTS/
<<<<<<< HEAD
=======
docker-compose down
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32
pipenv run python provision.py ../../tests/utilities/simpleBTSProvision/config.yml
