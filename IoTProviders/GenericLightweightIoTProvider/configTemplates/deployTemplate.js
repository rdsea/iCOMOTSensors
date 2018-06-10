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
          /* can be "direct" or service style
           for service style we need stop_script to kill the function
          */
          "script_model": "direct"
        },
        {
          "functionname":"simplepython",
          /* make sure the absolute path and execution mode */
          "start_script": "configTemplates/deploy-python.sh",
          /* must be implemented. Currently we have not supported it yet */
          "stop_script": "ls",
          "script_model": "direct"
        },
        {
          "functionname":"simplenodered",
          "start_script": "/usr/local/node/bin/node-red",//configTemplates/deploy-single-nodered.sh",
          "script_model": "direct"
        },
        {
          "functionname":"simplescala",
          "start_script": "configTemplates/deploy-scala.sh",
          /* must be implemented */
          "stop_script" : "ls",
          "script_model": "direct"
        },
        {
          "functionname":"simplesleep",
          "start_script": "sleep 1000",
          "script_model": "direct"
        },
        {
          "functionname":"n2disk",
          "start_script": "configTemplates/deploy-n2disk.sh",
          "stop_script" :"ls",
          "script_model": "direct"
        },
        {
          "functionname":"mqtt",
          "start_script": "/usr/sbin/mosquitto",
          "stop_script" :"ls",
          "script_model": "direct"
        }
      ]
    }
export default template;
