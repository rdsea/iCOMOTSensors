//this is used to test mongodb connection for the service
var chai = require('chai')
  , expect = chai.expect
  , should = chai.should();
chai.use(require('chai-url'));
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//test if MONGODB_URL is not null
//the mongodbl URL comes from the environment variable
const MONGODB_URL= process.env.MONGODB_URL;
expect(MONGODB_URL).to.have.protocol("mongodb");
var connection = mongoose.createConnection(MONGODB_URL,{useNewUrlParser: true });
connection.on('error', function(err) {
  console.log(err)
});
var DataTransformerSchema= new mongoose.Schema( {
    location: String,
    createdAt: Number,
    sliceId: String,
    qos: Number,
    datatransformerId: String,
    port: Number,
    url: String
});

var DataTransformerResource= connection.model('DataTransformerResource',DataTransformerSchema);
expect(DataTransformerResource).to.not.equal(null);

connection.on('connected', function () {
  console.log("Connected");
  var test_sample = new DataTransformerResource({ location: '1',createdAt:12345,sliceId:'slice1',qos:0,datatransformerId:'123446',port:0,url:MONGODB_URL });
  console.log(test_sample);
  expect(test_sample).to.not.equal(null);
  expect(test_sample.sliceId).to.be.equal('slice1');
  test_sample.save().then((doc) => {
  console.log("Wait for return");
    expect(doc).to.not.equal(null);
    console.log(doc);
    doc.sliceId.should.to.equal("slice1");
  });
});
