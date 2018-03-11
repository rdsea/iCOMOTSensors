import express from 'express';
import bodyParser from 'body-parser';
import * as services from './services';
import * as sensorTypes from './data/models/sensorTypes';

const PORT = 3001;
var app = express();

// middleware declaration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

router.get('/', (req, res) => {
    res.json(services.getSampleConfigs());
});

router.delete('/:sensorId', (req, res) => {
    res.json(services.deleteSensor(req.params.sensorId));
})

// generate routes for each of the sensor types
Object.keys(sensorTypes).forEach((sensorType) => {
    router.get(`/${sensorType}`,(req, res) => {
        services.findSensors(sensorType).then((sensors) => {
            res.json(sensors);
        })
    });

    router.post(`/${sensorType}`, (req, res) => {
        services.provision(req.body, sensorType).then((sensor) => {
            res.json(sensor);
        });
    });
})

app.use('/sensor/bts', router);
app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`)
})

