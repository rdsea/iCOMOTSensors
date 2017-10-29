var Influx = require('influx');

let config = null;
let influx = null;

// function to initialize the data connection
// should be used for setup operations i.e. creating the databases/tables
function init(conf){
    config = conf;
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

let influxPlugin = {
    init,
    insert,
};

export default influxPlugin;

