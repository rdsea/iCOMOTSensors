import mongoose from 'mongoose';

const MONGODB_URL = 'mongodb://iotcloudexamples:ac.at.tuwien.dsg@iotcloudexamples-shard-00-00-pz2vu.mongodb.net:27017,iotcloudexamples-shard-00-01-pz2vu.mongodb.net:27017,iotcloudexamples-shard-00-02-pz2vu.mongodb.net:27017/iotcamera?ssl=true&replicaSet=IoTCloudExamples-shard-0&authSource=admin';

mongoose.connect(MONGODB_URL, { useMongoClient: true });
mongoose.Promise = global.Promise;

export default mongoose;