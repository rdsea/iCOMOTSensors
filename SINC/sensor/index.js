import express from 'express';
import bodyParser from 'body-parser';
import * as sensorDAO from './data/sensor';
import * as brokerDAO from './data/broker';
import * as services from './services';

const PORT = 3000;
var app = express();

// middleware declaration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

router.get('/', (req, res) => {
    sensorDAO.find(req.params).then((sensors) => {
        res.json(sensors);
    }).catch((err) => {
        res.status = 500;
        res.json({message: 'error occurred while fetching sensors'});
    });
});

router.post('/', (req, res) => {
    // try to find an existing sensor with this configuration
    sensorDAO.find(req.body).then((sensors) => {
        if(sensors.length > 0){
            // found sensors, return result
            res.json(sensors);
        } 
    }).then(() => {
        if(res.headersSent) return;
        return brokerDAO.findRandom();
    }).then((broker) => {
        if(res.headersSent) return;
        let newSensor = { ...req.body };
        if(!(newSensor.broker))
            newSensor.broker = broker.host;
        return sensorDAO.create(newSensor);
    }).then((result) => {
        if(res.headersSent) return;
        return services.createSensorConfigMap(result.ops[0]);
        res.json(result.ops[0]);
    }).then((sensorConfig) => {
        if(res.headersSent) return;
        return services.provisionSensor(sensorConfig);
    }).then((sensor) => {
        res.json(sensor);
    })
    .catch((err) => {
        res.status = 500;
        console.log(err);
        res.json({message: 'error occurred while provisioning sensor'});
    });
});

router.delete('/:clientId', (req, res) => {
    sensorDAO.deleteSensor(req.params.clientId).then((result) => {
        res.json(result);
        return services.deleteSensor(req.params.clientId);
    });
})


app.use('/sensor', router);
app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`)
})