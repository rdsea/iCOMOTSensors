const express = require("express");
const bodyParser = require("body-parser");
const services = require("./src/services");

const PORT = 3005;
var app = express();

// middleware declaration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

router.get("/", (req, res) => {
    res.json({
        url:'/ingestionClient/',
        sampleConfiguration: {
            "broker": {
              "host": "localhost",
              "port": 1883,
            },
            "vessel": {
              "boat": "MAERSK ADRIATIC",
              "status": "Expected",
              "arrival": "6/5/2018",
              "departure": "6/6/2018",
              "destination": "VLC",
              "terminal": "TCV STEVEDORING COMPANY S.A."
            }
          },
    });
})

router.get('/list', (req, res) => {
    services.getVessel().then((vessels) => {
        res.json(vessels);
    })
});

router.post('/', (req, res) => {
    services.createVessel(req.body).then((vessel) => {
        res.json(vessel);
    })
});

router.delete('/:boatId', (req,res) => {
    services.deleteVessel(req.params.boatId).then(() => {
        res.json({ message: `${req.params.boatId} successfully removed`});
    })
})

router.get('/:boatId', (req, res) => {
    services.getVessel(req.params.boatId).then((vessel) => {
        res.json(vessel);
    })
})

app.use('/vessel', router);
app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`)
})