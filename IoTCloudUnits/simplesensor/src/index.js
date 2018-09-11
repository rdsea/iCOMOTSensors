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



//TODO enable internal time
function start(){
    // read csv
    let stream = fs.createReadStream(path.join(__dirname, `../${config.file}`));
    let csvStream = csv({headers : true}).on('data', (data) => {
        let payload = transform(data);
        csvStream.pause();
        output(payload, config.uri, config.protocolOptions).then(() => {
            setTimeout(() => csvStream.resume(), 3000);
        });
    });

    stream.pipe(csvStream);
    csvStream.on('end', () => {setTimeout(() => start(), 3000);})
}


start()
