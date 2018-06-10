import express from 'express';
import bodyParser from 'body-parser';
import * as services from './services';

const PORT = 3002;
var app = express();

// middleware declaration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

router.get('/', (req, res) => {
    res.json({
        url:'/mosquittobroker/',
        sampleConfiguration: {
        }
    });
});

router.post('/', (req, res) => {
    services.createBroker(req.body).then((mosquittobroker) => {
        res.json(mosquittobroker.toJSON());
    })
});

router.get('/list', (req, res) => {
    services.getBrokers().then((mosquittobrokers) => {
        res.json(mosquittobrokers);
    })
})

router.delete('/:brokerId', (req,res) => {
    services.deleteBroker(req.params.brokerId).then(() => {
        res.json({ message: `${req.params.sliceId} successfully removed`});
    })
})

router.get('/:brokerId', (req, res) => {
    services.getBrokers(req.params.brokerId).then((mosquittobrokers) => {
        res.json(mosquittobrokers);
    })
})

router.get('/:brokerId/logs', (req, res) => {
    services.getLogs(req.params.brokerId).then((logs) => {
        res.json(logs)
    })
})

app.use('/mosquittobroker', router);
app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`)
})
