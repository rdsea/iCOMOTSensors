const Promise = require('bluebird');
const GoogleCloudStorage = Promise.promisifyAll(require('@google-cloud/storage'));
const fs = require('fs');
const request = require('request');
const config = require('./config');


const storage = GoogleCloudStorage({
    keyFilename: config.keyFileName
});

let myBucket = storage.bucket(config.bucketName);

module.exports = {uploadToBucket: uploadToBucket, changeBucket:changeBucket};

function changeBucket(bucketName){
    config.bucketName = bucketName;
    myBucket = storage.bucket(config.bucketName);
}

function uploadToBucket(url){
    let filename = generateFilename(url);
    return download(url, filename)
        .then((data) => upload(data))
        .then(() => getPublicThumbnailUrlForItem(filename));
}

function getPublicThumbnailUrlForItem(filename) {
    return new Promise((resolve) => {resolve(`https://storage.googleapis.com/${config.bucketName}/${filename}`)});
}

function generateFilename(url){
    return new Date().getTime() + "_" + url.split("/").pop();

}

function download(url, dest) {
    return new Promise((resolve, reject) => {
        let file = fs.createWriteStream(dest);
        let sendReq = request.get(url);

        // verify response code
        sendReq.on('response', function (response) {
            if (response.statusCode !== 200) {
                reject(new Error(response));
            }
        });

        // check for request errors
        sendReq.on('error', function (err) {
            fs.unlink(dest, () => {
            });
            reject(err);
        });

        sendReq.pipe(file);

        file.on('finish', function () {
            file.close(() => {
                resolve(dest)
            });
        });

        file.on('error', function (err) { // Handle errors
            fs.unlink(dest); // Delete the file async. (But we don't check the result)
            reject(err);
        });
    });
}

function upload(filename){
    return myBucket.uploadAsync(filename, { public: true }).then(()=>{
        fs.unlink(filename, ()=>{})
    });
}
