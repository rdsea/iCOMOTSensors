#!/bin/sh

# set the cloud project id
gcloud -q config set project iotcloudexamples

# set the compute zone to somewhere in europe
gcloud -q config set compute/zone europe-west1-b

# get cluster credentials to interact
gcloud -q container clusteres get-credentials iotcloudexamples
