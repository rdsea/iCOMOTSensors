# IoT Proders

This folder contains REST API servers that will configure and provision the IoT Cloud Units

# Usage

Make sure the tools `gcloud` and `kubectl` are present when deploying. Easiest would be to use a google compute instance with these tools already installed

All scripts to setup a cluster where IoT Cloud Units will be provisioned, as well as configuring an instance to deploy on the cluster, can be found in the `/setup` folder

# Containerization

the root dockerfile creates a container with the required gcloud dependencies and build a base image that providers can use, so that the authentication credentials and tools are already present. To create a new base image a `keyfile.json` service account from google cloud is required

Each provider has their own Dockerfiles that create containerized versions of themselves.
