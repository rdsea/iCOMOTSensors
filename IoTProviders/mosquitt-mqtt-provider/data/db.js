import mongoose from 'mongoose';
const chai = require('chai');
chai.use(require('chai-url'));
const MONGODB_URL = process.env.MONGODB_URL;
chai.expect(MONGODB_URL).to.have.protocol('mongodb');

mongoose.connect(MONGODB_URL, { useMongoClient: true });
mongoose.Promise = global.Promise;

export default mongoose;
