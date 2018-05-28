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
          /* the script here is a direct commandline */
          "start_script": "ls -al",
          /* can be "direct" or file */
          "script_model": "direct"
        },
        {
          "functionname":"simplepython",
          "start_script": "/usr/bin/python ",
          "script_model": "direct"
        },
        {
          "functionname":"simpledocker",
          "start_script": "nohup docker run hello-world",
          "script_model": "direct"
        },
        {
          "functionname":"simplescala",
          "start_script": "/usr/bin/scala   &",
          "script_model": "direct"
        },
        {
          "functionname":"simplesleep",
          "start_script": "sleep 1000",
          "script_model": "direct"
        },
      ]
    }
export default template;
