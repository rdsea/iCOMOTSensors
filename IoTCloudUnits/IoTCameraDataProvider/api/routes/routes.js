'use strict';

/**
* Created by Tran The Vu on 15/11/2017.
* Email: anhvaut@gmail.com/vu.tran@vnuk.edu.vn
*/

export default function(app) {
	var cameraController = require('../controllers/camera-controller');

	app.route('/camera/:datapoint/list/all')
		.get(cameraController.listAllVideoFrames);

	app.route('/camera/:datapoint/list/:time')
		.get(cameraController.getVideoFrameByTime);
};
