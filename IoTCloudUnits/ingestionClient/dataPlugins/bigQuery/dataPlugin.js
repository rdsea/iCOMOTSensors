var BigQuery = require('@google-cloud/bigquery');
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'

let config = null;
let dataset = null;
let tables = {};
let topics = {};

try{
    config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'config.yml'), 'utf8'));
    console.log('configuration accepted');
}catch(err){
    console.log(err);
    console.log('no valid configuration received, exiting...');
    process.exit(1);
}

function init(){
    const bigQuery = BigQuery({
        projectId: config.projectId,
        keyFilename: path.join(__dirname, 'keyfile.json'),
    });

	// match topics to table names
	for(let table of config.tables){
		for(let topic of table.topics){
			topics[topic] = table.id;
		}
	}

    return bigQuery.getDatasets().then((datasets) => {      
        for(let set of datasets[0]){
            if(set.id === config.name)
                dataset = set;
        }
        if(dataset){
            return dataset;
        }else{
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
            if(tables[table.id]) continue;
            // create a new table
            newTables.push(dataset.createTable(table.id, {schema: table.schema}));
        }
        return Promise.all(newTables);
    }).then((res) => {
        for(let result of res){
            let table = result[0];
            tables[table.id] = table;
        }
        console.log('tables successfully created');
    });
}

function insert(topic, data){
    if(topics[topic]){
		return tables[topics[topic]].insert(data);
    }else{
        // topic not declared!
        console.log(`failure inserting into ${topic}, table not defined in config! object: ${JSON.stringify(data)}`);
    }
}

let dataPlugin = {
    init,
    insert,
}

export default dataPlugin;
