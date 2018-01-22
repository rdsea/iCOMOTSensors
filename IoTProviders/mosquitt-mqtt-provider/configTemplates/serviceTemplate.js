/*
  Service template for google container engine
*/

var template = {
    "apiVersion": "v1",
    "kind": "Service",
    "metadata": {
      "name": "mosquittobroker",
      "labels": {
        "app": "mosquittobroker",
        "role": "iotcloudexamples",
        "tier": "iotcloudexamples"
      }
    },
    "spec": {
      "type": "LoadBalancer",
      "ports": [
        {
          "port": 1883,
          "targetPort": 1883 
        }
      ],
      "selector": {
        "app": "mosquittobroker",
        "role": "iotcloudexamples",
        "tier": "iotcloudexamples"
      }
    }
  }

export default template;