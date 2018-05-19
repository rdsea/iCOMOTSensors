/*
  Deployment template for google container engine
*/

var template = {
    "apiVersion": "extensions/v1beta1",
    "kind": "Deployment",
    "metadata": {
      "name": "genericlightweightiotfunction"
    },
    "functions": [
        {
          "functionname":"simplels",
          "start_script": "ls -al"
        },
        {
          "functionname":"simplepython",
          "start_script": "/usr/bin/python &"
        },
        {
          "functionname":"simpledocker",
          "start_script": "docker run hello-world"
        }
      ]
    }
export default template;
