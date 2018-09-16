const express = require("express");
const bodyParser = require("body-parser");
const services = require("./src/services");

const PORT = 9999;
var app = express();

// middleware declaration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var router = express.Router();

//DELETE must be implemented.

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
//TODO
//TRUCK will be updated based on another program which listens the events
//from the gate
router.post("/register/truck", (req, res) => {
    services.registerTruck(req.body).then((registeredTruck) => {
        res.json(registeredTruck);
    })
})
router.get("/truck/:licensePlate", (req, res) => {
    services.findTrucksInPort(req.params.licensePlate).then((trucks) => {
        res.json(trucks);
    })
})

//Crane will be added either by crane itself or a cranner provider
router.post("/register/crane", (req, res) => {
    services.registerCrane(req.body).then((registeredCrane) => {
        res.json(registeredCrane);
    })
})
router.get("/crane/:craneId", (req, res) => {
    services.findCranesInPort(req.params.craneId).then((cranes) => {
        res.json(cranes);
    })
})

app.use('/portcontrol', router);
app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`)
})
