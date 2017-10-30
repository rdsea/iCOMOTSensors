var Influx = require('influx');
import yaml from 'js-yaml'
import fs from 'fs'

let config = null;
let influx = null;

try{
    config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'config.yml'), 'utf8'));
    console.log('configuration accepted');
    console.log(config);
}catch(err){
    console.log(err);
    console.log('no valid configuration received, exiting...');
    process.exit(1);
}

// function to initialize the data connection
// should be used for setup operations i.e. creating the databases/tables
function init(){
    influx = new Influx.InfluxDB({
        host: config.host,
        database: config.name,
    });

    return influx.getDatabaseNames()
    .then(names => {
        console.log(names)
        if (!names.includes(config.name)) {
            console.log(`creating database ${config.name}`);
            return influx.createDatabase(config.name);
      }
    });
}

// function used to insert the data (i.e. contents of a message) into your chosed data provider
function insert(topic, data){
    return influx.writePoints([
        {
          measurement: topic,
          fields: { ...data },
        }
    ]);
}

let dataPlugin = {
    init,
    insert,
};

export default dataPlugin;

