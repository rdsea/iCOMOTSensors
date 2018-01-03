import mongoose from './db';

var Camera = mongoose.model('camera', {
    id: String,
    name: String,
    description: String,
    address: String,
    phonenumber: String,
    type: String,
    datapoint: String,
    datapoint_controller: String,
    fps: String,
    conn: {
        type: String,
        peer: String,
        slow: String,
        recv: String,
        connections: []
    }
}, 'camera');

export default Camera;
