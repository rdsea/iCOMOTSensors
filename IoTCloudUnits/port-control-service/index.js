const express = require("express");
const bodyParser = require("body-parser");
const services = require("./src/services");

const PORT = 9999;
var app = express();

// middleware declaration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var router = express.Router();

router.get("/", (req, res) => {
    services.findAllVessels().then((vessels) => {
        res.json(vessels);
    })
})

router.post("/register", (req, res) => {
    services.registerVessel(req.body).then((registeredVessel) => {
        res.json(registeredVessel);
    })
})

router.get("/vessel/terminal/:terminal", (req, res) => {
    services.findVesselsInTerminal(req.params.terminal).then((vessels) => {
        res.json(vessels);
    })
})

app.use('/portcontrol', router);
app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`)
})