var BigQuery = require('@google-cloud/bigquery');
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'
import moment from 'moment'
import logger from '../../logger'

let config = null;
let dataset = null;
let tables = {};
let topics = {};
let test = false;

try{
    config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'config.yml'), 'utf8'));
    logger.info('bigQuery configuration accepted');
}catch(err){
    logger.error(err);
    logger.error('no valid bigQuery configuration received, exiting...');
    process.exit(1);
}

function setTestMode(){
    test = true
}

function init(){
    const bigQuery = BigQuery({
        keyFilename: path.join(__dirname, 'keyfile.json'),
    });

    return new Promise((resolve, reject) => {
        // match topics to table names
        for(let table of config.tables){
            for(let topic of table.topics){
                topics[topic] = table.id;
            }
        }

        let dataset = bigQuery.dataset(config.dataset);
        for(let table of config.tables){
            tables[table.id] = dataset.table(table.id);
        }
        resolve();
    })
}

function insert(topic, data){
    if(topics[topic]){
        // if(test){
        //     data.arrival = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
        // }
		return tables[topics[topic]].insert(data).catch((err) => {
            logger.error(`failure inserting into bigQuery object: ${JSON.stringify(data)}`);            
            logger.error(err);
        });
    }
    logger.warn(`topic ${topic} is not configured to a bigQuery table!`);
    return new Promise((reject, resolve) => resolve());
}

let dataPlugin = {
    init,
    insert,
    setTestMode,
}

export default dataPlugin;
