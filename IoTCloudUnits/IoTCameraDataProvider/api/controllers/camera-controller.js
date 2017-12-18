
/**
* Created by Tran The Vu on 15/11/2017.
* Email: anhvaut@gmail.com/vu.tran@vnuk.edu.vn
*/

var dngGameraService = require('../services/dng-camera-service');
var urlVideoChannel = 'http://2co2.vp9.tv/chn/';

/**
 * loadVideoFrameFromUrl - load video frame from url of a camera from Danang public camera
 */
exports.listAllVideoFrames = function(req, res) {
  var datapoint = req.params.datapoint;
  datapoint = formURLFromDatapoint(datapoint);
  console.log(datapoint);

  dngGameraService.loadVideoFrameFromUrl(datapoint);
  var listOfVideoFrames = dngGameraService.getListOfVideoFrames();

  res.json(listOfVideoFrames);

};

/**
 * getVideoFrameByTime - load video frame from url of a camera from Danang public camera
 */
exports.getVideoFrameByTime = function(req, res) {
  var time = req.params.time;
  var datapoint = req.params.datapoint;
  datapoint = formURLFromDatapoint(datapoint);

  console.log(datapoint);

  dngGameraService.loadVideoFrameFromUrl(datapoint);

  if (time === 'now'){
    var videoFrame = dngGameraService.getLastestVideoFrame();
    res.json(videoFrame);
  }
  
};

/**
 * formURLFromDatapoint 
 * conver datapoint from  2co2.vp9.tv@DNG33 to http://2co2.vp9.tv/chn/DNG33/
 */
var formURLFromDatapoint = function(datapoint){
	var _datapoint = datapoint.replace("@","/");
    _datapoint = _datapoint.replace("@","/");
	_datapoint = "http://" + _datapoint;

	return _datapoint;
}


