
/**
* Created by Tran The Vu on 15/11/2017.
* Email: anhvaut@gmail.com/vu.tran@vnuk.edu.vn
*/

import * as dngCameraService from '../services/dng-camera-service';
import * as googleStorageService from '../services/google-storage-service';
import { writeFileSync } from 'fs';

/**
 * loadVideoFrameFromUrl - load video frame from url of a camera from Danang public camera
 */
export function listAllVideoFrames(req, res) {
  let cameraName = req.params.cameraName;
  cameraName = formURLFromCameraName(cameraName);

  dngCameraService.loadVideoFrameFromUrl(cameraName).then((listOfVideoFrames) => {
    res.json(listOfVideoFrames);
  }).catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
};


/**
 * getVideoById - load video with id from camera
 */
export function getVideoById(req, res){
  let videoId = req.params.videoId;
  let cameraName = formURLFromCameraName(req.params.cameraName);

  dngCameraService.loadVideoFrameFromUrl(cameraName).then((listAllVideoFrames) => {
    let videoFrame = dngCameraService.getVideoById(listAllVideoFrames, videoId);
    res.json(videoFrame);
  })
}

/**
 * getVideoFrameByTime - load video frame from url of a camera from Danang public camera
 */
export function getVideoFrameByTime(req, res) {
  let time = req.params.time;
  let cameraName = req.params.cameraName;
  cameraName = formURLFromCameraName(cameraName);
  dngCameraService.loadVideoFrameFromUrl(cameraName).then((listOfVideoFrames) => {
    let videoFrame = null;
    if (time === 'now'){
      videoFrame = dngCameraService.getLastestVideoFrame(listOfVideoFrames);
    }else{
      videoFrame = dngCameraService.getVideoFrameAt(listOfVideoFrames, time);
    }
    res.json(videoFrame);
  }).catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });; 
};

export function listAllCameras(req, res){
  dngCameraService.findAll().then((cameras) => {
    res.json(cameras);
  })
}

export function exportVideo(req, res){
  let url = formURLFromCameraName(req.params.cameraName);
  url = `${url}/${req.body.videoName}`
  let storage = req.body.storage;

  dngCameraService.downloadVideo(url).then((video) => {
    return googleStorageService.uploadVideo(req.params.cameraName, req.body.videoName, video);
  }).then((downloadUrl) => {
    res.json({ downloadUrl });
  }).catch((err) => {
    console.log(err);
    res.status(400).json({ error: err.message });
  });
}

/**
 * formURLFromCameraName 
 * conver cameraName from  2co2.vp9.tv@DNG33 to http://2co2.vp9.tv/chn/DNG33/
 */
function formURLFromCameraName(cameraName){
	let _cameraName = cameraName.replace("@","/");
    _cameraName = _cameraName.replace("@","/");
	_cameraName = "http://" + _cameraName;

	return _cameraName;
}


