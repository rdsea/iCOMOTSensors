import User from '../../data/user';
import shortid from 'shortid';

export function getBucketName(email){
    return User.findOne({ email }).then((user) => {
        return user.bucketName;    
    });
}

export function registerUser(email){
    let bucketName = shortid.generate().toLowerCase();
    let user = new User({ email, bucketName});
    return user.save();
}