/*
  Deployment template for google container engine
*/

var template = {
    "apiVersion": "extensions/v1beta1",
    "kind": "Deployment",
    "metadata": {
      "name": "alarmclient"
    },
    "spec": {
      "replicas": 1,
      "template": {
        "metadata": {
          "labels": {
            "app": "alarmclient",
            "role": "iotcloudexamples",
            "tier": "iotcloudexamples"
          }
        },
        "spec": {
          "volumes":[],
          "containers": [
            {
              "name": "alarmclient",
              "image": "rdsea/alarmclient",
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

module.exports = template;
