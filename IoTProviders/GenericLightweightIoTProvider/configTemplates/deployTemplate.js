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
          /* make sure the absolute path and execution mode */
          "start_script": "configTemplates/deploy-python.sh",
          /* must be implemented. Currently we have not supported it yet */
          "stop_script": "ls",
          "script_model": "direct"
        },
        {
          "functionname":"simpledocker",
          "start_script": "nohup docker run hello-world",
          "script_model": "direct"
        },
        {
          "functionname":"simplescala",
          "start_script": "configTemplates/deploy-scala.sh",
          /* must be implemented */
          "stop_script" : "ls",
          "script_model": "direct"
        }
      ]
    }
export default template;
