var request = require("request");
var fs = require('fs');
var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
  version: '0.1.0',
  addHelp:true,
  description: 'simple virtual sensor invocation'
});

parser.addArgument(
  [ '-p', '--provider' ],
  {
    help: 'sensorconfig'
  }
);

parser.addArgument(
  [ '-i', '--image' ],
  {
    help: 'sensorconfig'
  }
);

parser.addArgument(
  [ '-cf', '--config_file' ],
  {
    help: 'sensorconfig'
  }
);

var args = parser.parseArgs();


var sensor_configuration = JSON.parse(fs.readFileSync(args.config_file, 'utf8'));

  var request_body = {
          "image": args.image,
          "environment": [
              {
                  "name": "NODE_ENV",
                  "value": "production"
              }
          ],
          "files": [
              {
                  "name": "production.json",
                  "path": "/virtualdatahubsensor/config",
                  "body": JSON.stringify(sensor_configuration)
              }
          ]
  }
  var options = {
    method: 'POST',
    url: 'http://localhost:3009/docker',
    headers:
     {
       'Cache-Control': 'no-cache',
       'Content-Type': 'application/json'
     },
    body: JSON.stringify(request_body)
   }
  console.log(JSON.stringify(request_body))
 request(options, function (error, response, body) {
  if (error) throw new Error(error);
  console.log(body);
});
