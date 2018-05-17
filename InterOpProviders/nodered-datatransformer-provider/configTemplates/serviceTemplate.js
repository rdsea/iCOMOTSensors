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
      "type": "DataTransformer",
      "ports": [
        {
          "port": 81234,
          "targetPort": 81234
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
