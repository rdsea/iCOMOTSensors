/*
  Service template for google container engine
*/

var template = {
    "apiVersion": "v1",
    "kind": "Service",
    "metadata": {
      "name": "nodereddatatransformer",
      "labels": {
        "app": "nodereddatatransformer",
        "role": "iotcloudexamples",
        "tier": "iotcloudexamples"
      }
    },
    "spec": {
      "type": "LoadBalancer",
      "ports": [
        {
          "port": 1880,
          "targetPort": 1880
        }
      ],
      "selector": {
        "app": "nodereddatatranformer",
        "role": "iotcloudexamples",
        "tier": "iotcloudexamples"
      }
    }
  }

export default template;
