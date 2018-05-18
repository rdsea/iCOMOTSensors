# Simple Dockerfile for building a container with node
# Build it: e.g., $docker build -t firewallcontrolunit/sinc:0.1 .
FROM node:latest

# add all js  from the current directory
ADD . /tmp/firewallcontrolunit
# Install packages
RUN npm install
# make sure working directory
WORKDIR  /tmp/firewallcontrolunit
# this environment variable can be changed when running docker with --env
ENV NODE_ENV "dev"
#You can add other node commands to run. We dont as we will call the node using docker run
