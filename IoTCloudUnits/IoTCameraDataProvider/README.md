# Overview

This implements an IoT Camera Provider in the context of INTER-HINC (https://github.com/SINCConcept/HINC) and HAIVAN Project ( http://haivanuni.github.io/haivan/).

The IoT Camera Provider can be used for smart city camera analytics and IoT Interoperability.

## Installations

Using npm to install required package:

* npm install

## Requirements

### Mongo DB
The IoTCameraProvider uses MongoDB to store metadata about camera as resources. The MongoDB should be configured using  the environment MONGODB_URL:

*export MONGODB_URL=

Furthermore, we have our own sample camera information from Da Nang. For upload our sample camera JSON data into MongoDB (using upload_data.js utility), one also needs API key for Google map services.

* export GOOGLE_MAP_KEY

Contact us if you need the sample data.

### Google storage

There is a feature that allows a customer requests the IoTCameraProvider to push video into Google Storage. For this, A `keyfile.json` google credentials file is necessary in the root directory in this project. This service account should have write access to google cloud storage.

Furthermore, a cloud storage bucket `iotcamera` should exist !


## Run

* npm run build
* npm run start

## Running with Docker

For running the docker, MONGODB_URL environment must be provided. The default port (3000) can be changed by defined the variable PORT. Furthermore, port must be exposed to the outsider. 

Furthermore, a keyfile.json for accessing a Google Storage should be provided, if the provider is used to push data to Google Storage.

## Examples of APIs

### List all cameras
http://localhost:3000/camera/list

### List camera based on location

http://localhost:3000/camera/list/location?lon=&lat=&distance=


### List  all video frame of data point
http://localhost:3000/camera/:cameraName/list/all

For example, with a datapoint = 2co2.vp9.tv@DNG33, the URL will look like:
http://localhost:3000/camera/2co2.vp9.tv@chn@DNG33/list/all


### Get lastest video frame of data point

http://localhost:3000/camera/:cameraName/list/now

For example: datapoint = 2co2.vp9.tv@chn@DNG33, the URL will look like:

http://localhost:3000/camera/2co2.vp9.tv@chn@DNG33/list/now

### POST generate a download link for a video (via google cloud bucket)

http://localhost:3000/camera/:cameraName/
expects `videoName` in the body, should include the filetype extension

also expects `email` in the body, which the requester registered with

For example, curl -X POST -H "Content-Type: application/json" -d '{"videoName":"v206442.ts","email":"xyz@gmail.
com"}' http://localhost:3000/camera/2co2.vp9.tv@chn@DNG25/

would return the link for the video v206442.ts of the camera 2co2.vp9.tv@chn@DNG25 that you can download.

Note that we currently only support Google Storage and google account.
You need to register the account using the next POST command.

### POST register for usage
http://localhost:3000/register/
expects `email` in the body, should be a valid gmail account. Allows the user to export and download videos.
Exported videos are stored in a google cloud storage bucket shared with the regisered user. This call will return a google cloud storage download link that expires after 3 days.

Example of registering a user:
$curl -X POST -H "Content-Type: application/json" -d '{"email":"XYZ@gmail.com"}' http://localhost:3000/register
