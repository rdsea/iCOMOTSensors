#!/bin/bash

curl --location --request POST '127.0.0.1:5000/command' -H 'Content-Type: application/json' -d @command.json
