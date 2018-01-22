/*
  Deployment template for google container engine
*/

var template = {
    "apiVersion": "extensions/v1beta1",
    "kind": "Deployment",
    "metadata": {
      "name": "mosquittobroker"
    },
    "spec": {
      "replicas": 1,
      "template": {
        "metadata": {
          "labels": {
            "app": "mosquittobroker",
            "role": "iotcloudexamples",
            "tier": "iotcloudexamples"
          }
        },
        "spec": {
          "volumes":[],
          "containers": [
            {
              "name": "mosquittobroker",
              "image": "eclipse-mosquitto",
              "volumeMounts":[],
              "resources": {
                "requests": {
                  "cpu": "100m",
                  "memory": "100Mi"
                }
              },
              "ports": [
                {
                  "containerPort": 1883 
                }
              ] 
            }
          ]
        }
      }
    }
  }

export default template;
