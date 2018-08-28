const express = require('express');
const bodyParser = require('body-parser');
const service = require('./storage_service');

let router = express.Router();

router.use(bodyParser.json());

router.get("/", (req, res) => {
    service.uploadToBucket("https://www.jpl.nasa.gov/spaceimages/images/largesize/PIA00123_hires.jpg")
        .then((link)=>{res.send("<a href='" + link + "'>" + link + "</a>")});
});

router.put("/bucketname", (req, res) => {
    config.bucketName = req.body.bucketName;
   res.statusCode = 200;
   res.send("bucketname has been changed to: " + req.body.bucketName);
});

router.post("/dataurl", (req, res) => {
    let url = req.body.dataurl;
    service.uploadToBucket(url)
        .then((link)=>{res.send("<a href='" + link + "'>" + link + "</a>")});
});


module.exports = router;