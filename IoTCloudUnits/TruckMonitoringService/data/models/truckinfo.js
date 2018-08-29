import mongoose from '../db';

var TruckInfo = mongoose.model('TruckInfo', {
    license: String,
    isEntered:Boolean,
    inport: Boolean
});

export default TruckInfo;
