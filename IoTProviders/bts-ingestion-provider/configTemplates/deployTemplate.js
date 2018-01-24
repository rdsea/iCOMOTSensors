/*
  Deployment template for google container engine
*/

var template = {
    "apiVersion": "extensions/v1beta1",
    "kind": "Deployment",
    "metadata": {
      "name": "ingestionclient"
    },
    "spec": {
      "replicas": 1,
      "template": {
        "metadata": {
          "labels": {
            "app": "ingestionclient",
            "role": "iotcloudexamples",
            "tier": "iotcloudexamples"
          }
        },
        "spec": {
          "volumes":[],
          "containers": [
            {
              "name": "ingestionclient",
              "image": "rdsea/ingestion",
              "volumeMounts":[],
              "resources": {
                "requests": {
                  "cpu": "100m",
                  "memory": "100Mi"
                }
              },
              "ports": [
                {
                  "containerPort": 3000 
                }
              ] 
            }
          ]
        }
      }
    }
  }

export default template;
