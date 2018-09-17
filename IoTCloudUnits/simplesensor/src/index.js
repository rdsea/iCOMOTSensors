import fs from 'fs'
import csv from 'fast-csv';
import logger from './logger'
import transforms from './dataTransform';
import outputs from './output';
import config from '../config.json';
import path from 'path';

logger.info(`message output in ${config.format} format`);
logger.info(`messages sent through ${config.protocol}`);
logger.info(`messages sent to ${config.uri}`);

// get correct output and transform functions
let output = outputs[config.protocol];
let transform = transforms[config.format];



//TODO enable interval time and refactor the code so that
//real measurement can be done easily.

function start(){
    // here we emulate the sensor by reading data from a file.
    //for real sensor this can be change.
    let stream = fs.createReadStream(path.join(__dirname, `../${config.file}`));
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
