import mongoose from './db';

var SensorInstance = mongoose.model('SensorInstance', {
    broker: String,
    topic: String,
    sliceId: String,
    sensorId: String,
    createdAt: Number,
});

export default SensorInstance;