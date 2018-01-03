import express from 'express';
import bodyParser from 'body-parser';
import * as services from './services';

const PORT = 3000;
var app = express();

// middleware declaration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

router.get('/', (req, res) => {
    res.json({
        param: { 
            url:'/sensor/bts/param',
            sampleConfiguration: {
                broker: '127.0.0.1',
                topic: 'myTopic',
                sliceId: 'mySliceId',
            }
        },
        alert: { 
            url:'/sensor/bts/alert',
            sampleConfiguration: {
                broker: '127.0.0.1',
                topic: 'myTopic',
                sliceId: 'mySliceId',
            }
        },
    })
});

router.get('/param', (req, res) => {
    res.json({
        sampleConfiguration: {
            broker: '127.0.0.1',
            topic: 'myTopic',
            sliceId: 'mySliceId',
        }
    });
});

router.get('/alert', (req, res) => {
    res.json({
        sampleConfiguration: {
            broker: '127.0.0.1',
            topic: 'myTopic',
            sliceId: 'mySliceId',
        }
    });
});

router.post('/param', (req, res) => {
    services.createSensorInstance(req.body).then((sensor) => {
        res.json(sensor);
    })
})

// TODO
router.post('/alert', (req, res) => {
    res.json({ message: 'TODO' });
})

app.use('/sensor/bts', router);
app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`)
})

