/*
  Service template for google container engine
*/

var template = {
    "apiVersion": "v1",
    "kind": "Service",
    "metadata": {
      "name": "testrig",
      "labels": {
        "app": "testrig",
        "role": "iotcloudexamples",
        "tier": "iotcloudexamples"
      }
    },
    "spec": {
      "type": "LoadBalancer",
      "ports": [
        {
          "port": 80,
          "targetPort": 3000
        }
      ],
      "selector": {
        "app": "testrig",
        "role": "iotcloudexamples",
        "tier": "iotcloudexamples"
      }
    }
  }

export default template;