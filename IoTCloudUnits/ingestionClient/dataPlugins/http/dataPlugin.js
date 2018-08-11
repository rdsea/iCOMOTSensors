var BigQuery = require('@google-cloud/bigquery');
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'
import moment from 'moment'
import logger from '../../logger'
import axios from 'axios'

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
    logger.info(`ingested data will be sent to ${config.uri}`);
    return new Promise((resolve, reject) => resolve(true))
}

function insert(topic, data){
    return axios.post(config.uri, data);
}

let dataPlugin = {
    init,
    insert,
}

export default dataPlugin;
