import mongoose from '../db';

var Broker = mongoose.model('Broker', {
    location: String,
    createdAt: Number,
    sliceId: String,
    brokerId: String,
});

export default Broker;
