import fs from 'fs'
import csv from 'fast-csv';
import logger from './logger'
import transforms from './dataTransform';
import outputs from './output';
//import config from '../config.json';
import path from 'path';
var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
  version: '0.1.0',
  addHelp:true,
  description: 'arguments for simplesensor'
});
parser.addArgument(
  [ '-c', '--conf' ],
  {
    help: 'configuration information'
  }
);


var args = parser.parseArgs();

var configuration_file = null;

if (args.conf!=null) {
  configuration_file=args.conf;
}
else {
  if (process.env.SIMPLESENSOR_CONFIGURATION_FILE !=null) {
    configuration_file=process.env.SIMPLESENSOR_CONFIGURATION_FILE
  }
  else {
    configuration_file="config.json";
  }
}

var config =null

if (configuration_file !=null)
  config = JSON.parse(fs.readFileSync(configuration_file, 'utf8'));

logger.info(`message output in ${config.format} format`);
logger.info(`messages sent through ${config.protocol}`);
logger.info(`messages sent to ${config.uri}`);
logger.info(`dataset is ${config.file}`);
// get correct output and transform functions
let output = outputs[config.protocol];
let transform = transforms[config.format];



//TODO enable interval time and refactor the code so that
//real measurement can be done easily.

function start(){
    // here we emulate the sensor by reading data from a file.
    //for real sensor this can be change.
    let stream = fs.createReadStream(`${config.file}`);
    let csvStream = csv({headers : true}).on('data', (data) => {
    //if needed to transform the sensor format.
        let payload = transform(data);
        csvStream.pause();
    //output the sensor data to the predefined sink
        output(payload, config.uri, config.protocolOptions).then(() => {
            setTimeout(() => csvStream.resume(), 3000);
        });
    });

    stream.pipe(csvStream);
    csvStream.on('end', () => {setTimeout(() => start(), 3000);})
}

//start the main sensor function
start()
