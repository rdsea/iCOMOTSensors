import mongoose from 'mongoose';
const chai = require('chai');
chai.use(require('chai-url'));
const MONGODB_URL = process.env.MONGODB_URL;
chai.expect(MONGODB_URL).to.have.protocol('mongodb');

//console.log(MONGODB_URL);
mongoose.connect(MONGODB_URL,{ useNewUrlParser: true,connectWithNoPrimary: true });
mongoose.Promise = global.Promise;

export default mongoose;
