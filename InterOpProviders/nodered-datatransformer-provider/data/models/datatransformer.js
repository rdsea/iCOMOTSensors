import mongoose from '../db';

var DataTransformer = mongoose.model('DataTransformer', {
    tenantId: String, //owner/tenant provided by creator
    description: String, //metadata provided by creator
    name: String, //metadata provided by creator
    //the following information is mostly dynamically obtained
    location: String,   //for some use cases
    createdAt: Number,    //this is the timestamp, just convert it todate
    sliceId: String,
    qos: Number,
    datatransformerId: String, //resource instance (internal id)
    port: Number,
    url: String
});

export default DataTransformer;
