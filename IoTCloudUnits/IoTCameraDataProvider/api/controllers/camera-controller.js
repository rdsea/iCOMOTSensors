
/**
* Created by Tran The Vu on 15/11/2017.
* Email: anhvaut@gmail.com/vu.tran@vnuk.edu.vn
*/

import * as dngCameraService from '../services/dng-camera-service';

/**
 * loadVideoFrameFromUrl - load video frame from url of a camera from Danang public camera
 */
export function listAllVideoFrames(req, res) {
  let datapoint = req.params.datapoint;
  datapoint = formURLFromDatapoint(datapoint);

  dngCameraService.loadVideoFrameFromUrl(datapoint).then((listOfVideoFrames) => {
    res.json(listOfVideoFrames);
  }).catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
};

/**
 * getVideoFrameByTime - load video frame from url of a camera from Danang public camera
 */
export function getVideoFrameByTime(req, res) {
  let time = req.params.time;
  let datapoint = req.params.datapoint;
  datapoint = formURLFromDatapoint(datapoint);
  dngCameraService.loadVideoFrameFromUrl(datapoint).then((listOfVideoFrames) => {
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

/**
 * formURLFromDatapoint 
 * conver datapoint from  2co2.vp9.tv@DNG33 to http://2co2.vp9.tv/chn/DNG33/
 */
function formURLFromDatapoint(datapoint){
	let _datapoint = datapoint.replace("@","/");
    _datapoint = _datapoint.replace("@","/");
	_datapoint = "http://" + _datapoint;

	return _datapoint;
}


