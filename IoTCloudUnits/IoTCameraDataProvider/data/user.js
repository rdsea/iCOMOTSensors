import mongoose from './db';

var User = mongoose.model('user', {
   email: { type: String, index: { unique: true } },
   bucketName: String,     
});

export default User;