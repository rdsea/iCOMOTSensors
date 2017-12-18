import { MongoClient } from 'mongodb';

const MONGODB_URL = 'mongodb://iotcloudexamples:ac.at.tuwien.dsg@iotcloudexamples-shard-00-00-pz2vu.mongodb.net:27017,iotcloudexamples-shard-00-01-pz2vu.mongodb.net:27017,iotcloudexamples-shard-00-02-pz2vu.mongodb.net:27017/test?ssl=true&replicaSet=IoTCloudExamples-shard-0&authSource=admin';
const DB_NAME = 'sinc';

export function find(query){
    let client = null;
    return MongoClient.connect(MONGODB_URL).then((c) => {
        client = c;
        let db = client.db(DB_NAME);
        return db.collection('sensors').find(query).toArray();
    }).then((sensors) => {
        client.close();
        return sensors;
    })
}

export function create(sensor){
    let document = {
        clientId: sensor.clientId,
        broker: sensor.broker,
        topic: sensor.topic,
        createdAt: Math.floor((new Date()).getTime()/1000),
    };

    let client = null;
    return MongoClient.connect(MONGODB_URL).then((c) => {
        client = c;
        let db = client.db(DB_NAME);
        return db.collection('sensors').insert(document);
    }).then((newSensor) => {
        client.close();
        return newSensor;
    })
}

export function deleteSensor(clientId){
    let client = null;
    return MongoClient.connect(MONGODB_URL).then((c) => {
        client = c;
        let db = client.db(DB_NAME);
        return db.collection('sensors').deleteOne({ clientId }).then((res) => {
            return res;
        });
    });
}

