import mongoose from '../db';

var DataTransformer = mongoose.model('DataTransformer', {
    location: String,
    createdAt: Number,
    sliceId: String,
    qos: Number,
    datatransformerId: String,
    port: Number,
});

export default DataTransformer;
