// import Storage from '@google-cloud/storage'

import Storage from '@google-cloud/storage';
import path from 'path';
import moment from 'moment';

const storage = Storage({
    keyFilename: path.join(__dirname, '../../keyfile.json'),
});

// videoName should include the filetype extension !
export function uploadVideo(cameraName, videoName, byteArray){
    let timestamp = Math.floor((new Date()).getTime()/1000);
    let filename = `${cameraName}/${timestamp}/${videoName}`;
    return new Promise((resolve, reject) => {
        let file = storage.bucket('iotcamera').file(filename);
        let stream = file.createWriteStream();
        stream.on('finish', () => resolve(file));
        stream.on('error', (err) => reject(err));

        stream.write(byteArray);
        stream.end();
    }).then((file) => {
        let expiration = moment().add(3,'days').format('MM-DD-YYYY');
        return file.getSignedUrl({ action: 'read', expires: expiration});
    });    
}