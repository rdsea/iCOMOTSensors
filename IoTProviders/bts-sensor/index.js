import express from 'express';
import bodyParser from 'body-parser';
import * as services from './services';

const PORT = 3000;
var app = express();

// middleware declaration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

router.delete('/param/:sensorId', (req, res) => {
    services.deleteSensor(req.params.sensorId).then(() => {
        res.json({ message: 'sensor successfully removed!' });
    }) 
})

router.post('/param', (req, res) => {
    services.createParamSensor(req.body).then((sensor) => {
        res.json(sensor);
    })
})

router.post('/alert', (req, res) => {
    services.createAlertSensor(req.body).then((sensor) => {
        res.json(sensor);
    })
})

router.get('/param', (req, res) => {
    services.getParamSensors().then((sensors) => {
        res.json(sensors);
    })
});

router.get('/alert', (req, res) => {
    services.getAlertSensors().then((sensors) => {
        res.json(sensors);
    })
})

router.get('/', (req, res) => {
    res.json({
        param: { 
            url:'/sensor/bts/param',
            sampleConfiguration: {
                broker: '127.0.0.1',
                topic: 'myTopic',
            },
            communication:['mqtt'],
            measurement: 'parameters',
            unit: 'xxx',
        },
        alert: { 
            url:'/sensor/bts/alert',
            sampleConfiguration: {
                broker: '127.0.0.1',
                topic: 'myTopic',
            },
            measurement: 'alerts',
            unit: 'yyy',
            communication: ['mqtt'],
        },
    })
});

app.use('/sensor/bts', router);
app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`)
})

