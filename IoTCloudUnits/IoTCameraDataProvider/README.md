#Overview

This implements an IoT Camera Provider in the context of HAIVAN Project ( http://haivanuni.github.io/haivan/) and INTER-HINC

The IoT Camera Provider can be used for smart city camera analytics and IoT Interoperability

## Installations
* npm install

## Run

* npm run start

## List  all video frame of data point
http://localhost:3000/camera/:datapoint/list/all
###For example: datapoint = 2co2.vp9.tv@DNG33
###URL will look like:
http://localhost:3000/camera/2co2.vp9.tv@chn@DNG33/list/all


## Get lastest video frame of data point
http://localhost:3000/camera/:datapoint/list/now
###For example: datapoint = 2co2.vp9.tv@chn@DNG33
###URL will look like:
http://localhost:3000/camera/2co2.vp9.tv@chn@DNG33/list/now


