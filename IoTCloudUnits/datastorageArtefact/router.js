const express = require('express');
const bodyParser = require('body-parser');
const service = require('./storage_service');

let router = express.Router();

router.use(bodyParser.json());

router.get("/", (req, res) => {
    service.uploadToBucket("https://www.jpl.nasa.gov/spaceimages/images/largesize/PIA00123_hires.jpg");
});

router.put("/bucketname", (req, res) => {
    config.bucketName = req.body.bucketName;
   res.statusCode = 200;
   res.send("bucketname has been changed");
});

router.post("/dataurl", (req, res) => {
    service.uploadToBucket("test");
});


module.exports = router;