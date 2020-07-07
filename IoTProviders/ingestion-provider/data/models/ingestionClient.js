import mongoose from '../db';
import { Schema } from 'mongoose';
import { W_OK } from 'constants';

var BrokerConfig = new Schema({
    host: String,
    port: Number,
    username: String,
    password: String,
    topics: [{type: String}],
})


var IngestionClient = mongoose.model('IngestionClient', {
    remoteDataLocation: String,
    ingestionClientId: String,
    createdAt: Number,
    sliceId: String,
    brokers: [BrokerConfig],
});



export default IngestionClient;
