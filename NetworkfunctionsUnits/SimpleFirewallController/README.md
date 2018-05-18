# A simple firewall as a network function

In this case, we build a simple firewall service atop
Google to control firewall of Google resources.
The idea is that we assume that various resources as
services running in a virtual environment (by Google VMs). We have a firewall as network function that we can dynamically control.

When running outside Google, this service can interface
to a real firewall backend.

## Configuration

Make sure you set the project and credential information. The project id is set
via the config file and the credential can be set using the environment variable.

$GOOGLE_APPLICATION_CREDENTIALS=[servicekey]
$GCLOUD_PROJECT
## Some samples

curl -X GET https://www.googleapis.com/compute/v1/projects/bigdatawithbigquery/global/firewalls
