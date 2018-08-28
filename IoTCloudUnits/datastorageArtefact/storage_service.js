const Promise = require('bluebird');
const GoogleCloudStorage = Promise.promisifyAll(require('@google-cloud/storage'));
const fs = require('fs');
const request = require('request');
const config = require('./config');


const storage = GoogleCloudStorage({
    keyFilename: config.keyFileName
});

const BUCKET_NAME = config.bucketName;
const myBucket = storage.bucket(BUCKET_NAME);

module.exports = {uploadToBucket: uploadToBucket};

function uploadToBucket(url){
    console.log(url);
    let filename = generateFilename(url);
    download(url, filename, ()=>{});
}

function generateFilename(url){
    return new Date().getTime() + "_" + url.split("/").pop();

}

function download(url, dest, cb) {
        var file = fs.createWriteStream(dest);
        var sendReq = request.get(url);

        // verify response code
        sendReq.on('response', function(response) {
            if (response.statusCode !== 200) {
                cb(response);
            }
        });

        // check for request errors
        sendReq.on('error', function (err) {
            fs.unlink(dest, ()=>{});
            cb(err.message);
        });

        sendReq.pipe(file);

        file.on('finish', function() {
           file.close(upload(dest));
        });

        file.on('error', function(err) { // Handle errors
            fs.unlink(dest); // Delete the file async. (But we don't check the result)
            cb(err.message);
        });
}

// upload file to bucket

function upload(filename){

    myBucket.uploadAsync(filename, { public: true })
        .then(file => {
            // file saved
            console.log("upload of " + filename + " successful")
            fs.unlink(filename, ()=>{});
        })
}