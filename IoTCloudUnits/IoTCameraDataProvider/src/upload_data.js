/**
 * This utility is used to upload a JSON description of cameras
 * into a backend mongodb database.
 * Sample of JSON description is available in google storage
 */
var fs = require('fs');
//one must have GOOGLE KEY for Google MAP
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAP_KEY
});
const winston = require('winston');
import Camera from '../src/data/camera';
winston.loggers.add('production', {
  console: {
    level: 'info',
    colorize: 'true',
    label: 'category one'
  }
});
const production_log = winston.loggers.get('production');
var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp:true,
  description: 'argument for upload camera data'
});
parser.addArgument(
  [ '-f', '--file' ],
  {
    help: 'input file'
  }
);

var args = parser.parseArgs();
production_log.info("Start look all camera and update");


var cameras = JSON.parse(fs.readFileSync(args.file, 'utf8'));
cameras.forEach(function(camera) {
    //console.log(camera);
    googleMapsClient.geocode({
      address: camera.address
    }, function(err, response) {
      if (!err) {
        camera.address=response.json.results[0].formatted_address;
        var location =[response.json.results[0].geometry.location.lng,response.json.results[0].geometry.location.lat];
        camera["location"] =location;
        //console.log(camera.location);
        var mcamera = new Camera(camera);
        console.log(mcamera.location);
        mcamera.save();
      }
    });
});
