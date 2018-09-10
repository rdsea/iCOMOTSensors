const express = require('express');
const bodyParser = require('body-parser');
const service = require('./storage_service');
const config = require('./config');

let router = express.Router();

router.use(bodyParser.json());

/*
GET / for faster testing
router.get("/", (req, res) => {
    service.uploadToBucket("https://www.jpl.nasa.gov/spaceimages/images/largesize/PIA00123_hires.jpg")
        .then((link)=>{res.send("<a href='" + link + "'>" + link + "</a>")});
});*/

router.put("/bucketname", (req, res) => {
    service.changeBucket(req.body.bucketname);
   res.statusCode = 200;
   res.send("bucketname has been changed to: " + req.body.bucketname);
});

router.post("/dataurl", (req, res) => {
    let url = req.body.dataurl;
    service.uploadToBucket(url)
        .then((link)=>{
            res.statusCode = 200;
            res.send(link + "\n")
        });
});


module.exports = router;