import mongoose from './db';
//using legacy coordination
var Schema = mongoose.Schema;
var CameraSchema =new Schema({
    id: String,
    name: String,
    description: String,
    address: String,
    //geojson: {
      //type: String,
      location: [Number], //mongodb: longitude first and latitude second
    //},
    geohash:String,
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
  }
);

CameraSchema.index({ "location": "2d" });
var Camera = mongoose.model('camera', CameraSchema, 'camera');

export default Camera;
