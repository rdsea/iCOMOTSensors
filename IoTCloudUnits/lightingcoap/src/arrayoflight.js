//Emulating a single light which is a coap server listen for command.

const light  = require('./light');
var fs = require('fs');
var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
  version: '0.1.0',
  addHelp:true,
  description: 'argument for light'
});
parser.addArgument(
  [ '-i', '--input' ],
  {
    help: 'configuration of light'
  }
);

var args = parser.parseArgs();

var config_list = JSON.parse(fs.readFileSync(args.input, 'utf8'));
config_list.forEach(function(item) {
  var new_light = light.initialize(item.address,item.port,item.name,item.control_config_file);
});
