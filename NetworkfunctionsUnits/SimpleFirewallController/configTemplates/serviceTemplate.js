/*
  Service template for google container engine
*/

var template = {
    "apiVersion": "v1",
    "kind": "Service",
    "metadata": {
      "name": "finalcontroller",
      "labels": {
        "app": "firewallcontroller",
        "role": "iotcloudexamples",
        "tier": "iotcloudexamples"
      }
    },
    "spec": {
      "type": "NetworkFunction",
      "ports": [
        {
          "port": 3456,
          "targetPort": 3456 
        }
      ],
      "selector": {
        "app": "firewallcontroller",
        "role": "iotcloudexamples",
        "tier": "iotcloudexamples"
      }
    }
  }

export default template;
