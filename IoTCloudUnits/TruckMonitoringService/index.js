import express from 'express';
import bodyParser from 'body-parser';
import * as services from './services';


const PORT = 3002;
var app = express();

// middleware declaration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

router.post('/', (req, res) => {
  services.processingData(req.body);
    res.json({
        url:'/truckmonitoring/',
        sampleConfiguration: {
          'message':'just a simple truck monitoring'
        }
    });
});


router.get('/list', (req, res) => {
    services.getTruckInfos().then((truckinfos) => {
        res.json(truckinfos);
    })
})


router.get('/list/:license', (req, res) => {
    services.getTruckInfos(req.params.license).then((truckinfos) => {
        res.json(truckinfos);
    })
})

app.use('/truckmonitoring', router);
app.listen(PORT, () => {
    console.log(`Truck Monitoring instance listening at port ${PORT}`)
})
