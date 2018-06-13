import mongoose from '../db';

var Broker = mongoose.model('Broker', {
    location: String,
    url:String,
    createdAt: Number,
    sliceId: String,
    qos: Number,
    brokerId: String,
});

export default Broker;
