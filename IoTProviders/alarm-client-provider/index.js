const express = require("express");
const bodyParser = require("body-parser");
const services = require("./src/services");

const PORT = 3006;
var app = express();

// middleware declaration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

router.get("/", (req, res) => {
    res.json({
        url:'/alarmclient/',
        sampleConfiguration: {
            "alarmBroker": {
              "host": "localhost",
              "port": 1883,
              "topics": [
                "topic1",
                "topic2"
              ]
            },
            "vesselBroker": {
              "host": "localhost",
              "port": 1883,
              "topics": [
                "vessel1",
                "vessel2"
              ]
            },
            "pcs": "http://localhost:8888"
          },
    });
})

router.get('/list', (req, res) => {
    services.getAlarmClient().then((alarmclients) => {
        res.json(alarmclients);
    })
});

router.post('/', (req, res) => {
    services.createAlarmClient(req.body).then((alarmclient) => {
        res.json(alarmclient);
    })
});

router.delete('/:alarmclientId', (req,res) => {
    services.deleteAlarmClient(req.params.alarmclientId).then(() => {
        res.json({ message: `${req.params.alarmclientId} successfully removed`});
    })
})

router.get('/:alarmclientId', (req, res) => {
    services.getAlarmClient(req.params.alarmclientId).then((alarmclient) => {
        res.json(alarmclient);
    })
})

app.use('/alarmclient', router);
app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`)
})