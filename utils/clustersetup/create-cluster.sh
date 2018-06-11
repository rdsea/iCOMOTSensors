#!/bin/sh

# set the cloud project id
gcloud -q config set project iotcloudexamples

# set the compute zone to somewhere in europe
gcloud -q config set compute/zone europe-west1-b

# create our cluster of 5 instances
gcloud -q container clusters create iotcloudexamples --num-nodes 5 --enable-network-policy

# get cluster credentials to interact
gcloud -q container clusters get-credentials iotcloudexamples
