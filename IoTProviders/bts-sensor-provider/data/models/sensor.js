import mongoose from './db';

var Sensor = mongoose.model('Sensor', {
    type: String,
    clientId: String,
    uri: String,
    topic: String,
    createdAt: Number,
    sensorId: String,
    type: String,
});

export default Sensor;
