var BigQuery = require('@google-cloud/bigquery');
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'
<<<<<<< HEAD
=======
import moment from 'moment'
import logger from '../../logger'
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32

let config = null;
let dataset = null;
let tables = {};
<<<<<<< HEAD

try{
    config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'config.yml'), 'utf8'));
    console.log('configuration accepted');
}catch(err){
    console.log(err);
    console.log('no valid configuration received, exiting...');
    process.exit(1);
}

=======
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

>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32
function init(){
    const bigQuery = BigQuery({
        projectId: config.projectId,
        keyFilename: path.join(__dirname, 'keyfile.json'),
    });

<<<<<<< HEAD
=======
    // match topics to table names
	for(let table of config.tables){
		for(let topic of table.topics){
			topics[topic] = table.id;
		}
    }
    
    // test mode
    // add departure and arrival columns
    if(test){
        for(let table of config.tables){
            table.schema.push({
                description: "message departure time",
                name: "departure",
                type: "TIMESTAMP",
            });

            table.schema.push({
                description: "message arrival time",
                name: "arrival",
                type: "TIMESTAMP",
            });
        }
    }

>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32
    return bigQuery.getDatasets().then((datasets) => {      
        for(let set of datasets[0]){
            if(set.id === config.name)
                dataset = set;
        }
        if(dataset){
<<<<<<< HEAD
            return dataset;
        }else{
=======
            logger.info(`dataset ${config.name} already exists, connecting to it...`);
            return dataset;
        }else{
            logger.info(`dataset ${config.name} does not yet exist, creating...`);
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32
            return bigQuery.createDataset(config.name);
        }
    }).then((dataset) => {        
        return dataset.getTables();
    }).then((tabs) => {
        // fill all tables with existing tables
        for(let table of tabs[0])
            tables[table.id] = table;
        
        let newTables = []
        for(let table of config.tables){
<<<<<<< HEAD
            if(tables[table.id]) continue;
            // create a new table
=======
            if(tables[table.id]){
                logger.info(`table ${table.id} already exists`);
                continue;
            }
            // create a new table
            logger.info(`creating table ${table.id}`);
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32
            newTables.push(dataset.createTable(table.id, {schema: table.schema}));
        }
        return Promise.all(newTables);
    }).then((res) => {
        for(let result of res){
            let table = result[0];
            tables[table.id] = table;
        }
<<<<<<< HEAD
        console.log('tables successfully created');
=======
        logger.info('tables successfully created');
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32
    });
}

function insert(topic, data){
<<<<<<< HEAD
    if(tables[topic]){
        return tables[topic].insert(data);
    }else{
        // table not declared!
        console.log(`failure inserting into ${topic}, table not defined in config! object: ${JSON.stringify(data)}`);
=======
    if(topics[topic]){
        if(test){
            data.arrival = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
        }
		return tables[topics[topic]].insert(data).catch((err) => {
            logger.error(`failure inserting into bigQuery object: ${JSON.stringify(data)}`);            
            logger.error(err);
        });
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32
    }
}

let dataPlugin = {
    init,
    insert,
<<<<<<< HEAD
=======
    setTestMode,
>>>>>>> cf2a084da5f96bbcb85c514781a0e9c861775c32
}

export default dataPlugin;
