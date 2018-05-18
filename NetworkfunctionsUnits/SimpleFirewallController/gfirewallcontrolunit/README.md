# A simple firewall control unit for Google

In this case, we build a simple firewall service atop
Google to control firewall of Google resources.
The idea is that we assume that various resources as
services running in a virtual environment (by Google VMs). We have a firewall as network function that we can dynamically control.

When running outside Google, this service can interface
to a real firewall backend.

## Architecture

A system is identified by a system id. We assume that in this system, there are many resources which use network capabilities.

A system has a back-end firewall component that manipulates the network firewall. A set of systems can be controlled by a firewall control unit. Our firewall control unit is a web service managing a set of systems and utilizes back-end firewall components.

With google firewall control unit, we have

- a system id is mapped to a "project id" of Google. In this system we have several resources and we will apply firewall for ingress and egress traffic

- a back-end component is the googleapis for managing firewalls (e.g., https://cloud.google.com/compute/docs/reference/rest/v1/firewalls)

We have a Dockerfile and a service that can be used to build a firewall control unit for google.

## Configuration

Make sure you set the project and credential information for each system.
They can be set the config file and the credential files should be stored in a specific directory.

For testing model, you can set the NODE_ENV like

$export NODE_ENV=dev

this means that the configuration file will be in config/dev.json.

see config/dev.json:

~~~~~~~~~~~~~~~~~~~~~
{
  "system_id":"test1",
  "google_project": "project1",
  "google_service_credential":"74a820857566.json"
}

~~~~~~~~~~~~~~~~~~~~~~~~~

Note that we assume that the google_service_credential will be
determined as

GLOBAL_GOOGLE_CREDENTIAL_DIR+"/"+google_project+"-"+google_service_credential

so you need to

$export GLOBAL_GOOGLE_CREDENTIAL_DIR=[dir]

## Some samples of usage

Post a new system to the resource:

$curl --header "Content-Type: application/json"  \
--request POST \
--data '{"system_id":"123","google_project":"xyz","google_service_credential":"aaaa"}' \
  http://localhost:3002/firewallresource/systems

## Authors

Hong-Linh Truong
