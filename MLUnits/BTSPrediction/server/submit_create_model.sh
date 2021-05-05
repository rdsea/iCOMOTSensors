#!/bin/bash

curl --location --request POST '127.0.0.1:5000/create_service' -H 'Content-Type: application/json' -d @server.json