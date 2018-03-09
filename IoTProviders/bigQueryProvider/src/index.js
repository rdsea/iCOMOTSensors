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
    let sampleConfig = {
        datasetId: 'datasetId',
        tables: [
            {
                id: 'tableId',
                schema:[
                    {
                        description: 'field description',
                        mode: 'REQUIRED/',
                        name: 'fieldname',
                        type: 'INT64/FLOAT64/STRING/BOOL/BYTES/DATE/DATETIME/TIME/TIMESTAMP',
                    }
                ]
            }
        ]
    }

    res.json({
        sampleConfig,
    });
});

router.post('/', (req, res) => {
    services.createDataset(req.body.datasetId).then((dataset) => {
        return services.createTables(req.body.datasetId, req.body.tables);
    }).then((dataset) => {
        res.json(dataset);
    })
});

router.delete('/:datasetId', (req, res) => {
    services.deleteDataset(req.params.datasetId).then(() => {
        res.json({message: `successfully deleted dataset ${req.params.datasetId}`});
    })
})

router.get('/list', (req, res) => {
    services.getDataset().then((datasets) => {
        res.json(datasets);
    })
})


router.get('/:datasetId', (req, res) => {
    services.getDataset(req.params.datasetId).then((dataset) => {
        res.json(dataset);
    })
})

app.use('/storage/bigquery', router);
app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`)
})

