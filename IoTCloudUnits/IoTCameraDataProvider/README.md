# Overview

This implements an IoT Camera Provider in the context of HAIVAN Project ( http://haivanuni.github.io/haivan/) and INTER-HINC

The IoT Camera Provider can be used for smart city camera analytics and IoT Interoperability

## Installations
* npm install

## Reqirements

A `keyfile.json` google credentials file is necessary in the root directory in this project. This service account should have write access to google cloud storage.

Furthermore, a cloud storage bucket `iotcamera` should exist !

## Run

* npm run build
* npm run start

## List all cameras
http://localhost:3000/camera/list

## List  all video frame of data point
http://localhost:3000/camera/:cameraName/list/all
###For example: datapoint = 2co2.vp9.tv@DNG33
###URL will look like:
http://localhost:3000/camera/2co2.vp9.tv@chn@DNG33/list/all


## Get lastest video frame of data point
http://localhost:3000/camera/:cameraName/list/now
### For example: datapoint = 2co2.vp9.tv@chn@DNG33
### URL will look like:
http://localhost:3000/camera/2co2.vp9.tv@chn@DNG33/list/now

## POST generate a download link for a video (via google cloud bucket)
http://localhost:3000/camera/:cameraName/
expects `videoName` in the body, should include the filetype extension

also expects `email` in the body, which the requester registered with

### POST register for usage
http://localhost:3000/register/
expects `email` in the body, should be a valid gmail account. Allows the user to export and download videos.
Exported videos are stored in a google cloud storage bucket shared with the regisered user

this call will return a google cloud storage download link that expires after 3 days.


