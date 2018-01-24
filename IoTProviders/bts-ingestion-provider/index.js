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
        url:'/ingestionClient/',
        sampleConfiguration: {
            sliceId: 'mySliceId',
        }
    });
});

router.post('/', (req, res) => {
    services.createIngestionClient(req.body).then((ingestionClient) => {
        res.json(ingestionClient.toJSON());
    })
});

router.delete('/:sliceId', (req,res) => {
    services.deleteBroker(req.params.sliceId).then(() => {
        res.json({ message: `${req.params.sliceId} successfully removed`});
    })
})

router.get('/:sliceId', (req, res) => {
    services.getBrokers(req.params.sliceId).then((mosquittobrokers) => {
        res.json(mosquittobrokers);
    })
})

app.use('/ingestionClient', router);
app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`)
})
