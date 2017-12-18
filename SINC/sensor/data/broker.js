import { MongoClient } from 'mongodb';

const MONGODB_URL = 'mongodb://iotcloudexamples:ac.at.tuwien.dsg@iotcloudexamples-shard-00-00-pz2vu.mongodb.net:27017,iotcloudexamples-shard-00-01-pz2vu.mongodb.net:27017,iotcloudexamples-shard-00-02-pz2vu.mongodb.net:27017/test?ssl=true&replicaSet=IoTCloudExamples-shard-0&authSource=admin';
const DB_NAME = 'sinc';

export function findRandom(){
    let client = null;
    return MongoClient.connect(MONGODB_URL).then((c) => {
        client = c;
        let db = client.db(DB_NAME);
        return db
            .collection('brokers')
            .aggregate([{
                '$sample': { size: 1 }
            }]).next();
    }).then((sensors) => {
        client.close();
        return sensors;
    })
}

