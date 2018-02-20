// import Storage from '@google-cloud/storage'

import Storage from '@google-cloud/storage';
import path from 'path';
import moment from 'moment';
import * as userService from './user-service';

const storage = Storage({
    keyFilename: path.join(__dirname, '../../keyfile.json'),
});

// videoName should include the filetype extension !
// we expect a gmail account to share the video with
export function uploadVideo(cameraName, videoName, byteArray, email){
    let timestamp = Math.floor((new Date()).getTime()/1000);
    let filename = `${cameraName}/${timestamp}/${videoName}`;
    return getUserBucket(email).then((bucket) => {
        return new Promise((resolve, reject) => {
            let file = bucket.file(`${filename}${timestamp}`);
            let stream = file.createWriteStream();
            stream.on('finish', () => resolve(file));
            stream.on('error', (err) => reject(err));

            stream.write(byteArray);
            stream.end();
        })    
    }).then((file) => {
        let expiration = moment().add(3,'days').format('MM-DD-YYYY');
        file.acl.readers.addUser(email);
        return file.getSignedUrl({ action: 'read', expires: expiration});
    });

}

function getUserBucket(email){
    let bucketName = null;
    return userService.getBucketName(email).then((name) => {
        bucketName = name;
        return storage.getBuckets();
    }).then((buckets) => {
        for(let i=0;i<buckets[0].length;i++){
            console.log(buckets[0][i].metadata.name);
            if(buckets[0][i].metadata.name === bucketName) return buckets[0][i];
        }
        return storage.createBucket(bucketName).then((data) => data[0] );
    }).then((bucket) => {
        bucket.acl.readers.addUser(email);
        return bucket;
    })
}


