const template = {
    "apiVersion": "networking.k8s.io/v1",
    "kind": "NetworkPolicy",
    "metadata": {
      "name": "allow"
    },
    "spec": {
      "podSelector": {
        "matchLabels": {
          "app": "servicename"
        }
      },
      "ingress": [
        // {
        //   "from": [
        //     // {
        //     //   "ipBlock": {
        //     //     "cidr": "0.0.0.0/0",
        //     //     "except": [
        //     //       "172.17.1.0/24"
        //     //     ]
        //     //   }
        //     // }
        //   ],
        //   "ports": [
        //     // {
        //     //   "protocol": "TCP",
        //     //   "port": 1880
        //     // }
        //   ]
        // }
      ]
    }
  }

  module.exports = template