/*
  Deployment template for google container engine
*/

var template = {
    "apiVersion": "extensions/v1beta1",
    "kind": "Deployment",
    "metadata": {
      "name": "nodereddatatransformer"
    },
    "spec": {
      "replicas": 1,
      "template": {
        "metadata": {
          "labels": {
            "app": "nodereddatatransformer",
            "role": "iotcloudexamples",
            "tier": "iotcloudexamples"
          }
        },
        "spec": {
          "volumes":[],
          "containers": [
            {
              "name": "nodereddatatranformer",
              "image": "noderedtransformerimage",
              "volumeMounts":[],
              "resources": {
                "requests": {
                  "cpu": "100m",
                  "memory": "100Mi"
                }
              },
              "ports": [
                {
                  "containerPort": 8123
                }
              ]
            }
          ]
        }
      }
    }
  }

export default template;
