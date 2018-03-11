import express from 'express';
import bodyParser from 'body-parser';
import * as services from './services';
import configTemplate, { bigQueryTemplate } from './configTemplates/ingestionConfigTemplate';

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
            ...configTemplate,
            bigQuery: {...bigQueryTemplate},
        },
    });
});

router.post('/', (req, res) => {
    services.createIngestionClient(req.body).then((ingestionClient) => {
        res.json(ingestionClient.toJSON());
    })
});

router.delete('/:ingestionClientId', (req,res) => {
    services.deleteIngestionClient(req.params.ingestionClientId).then(() => {
        res.json({ message: `${req.params.ingestionClientId} successfully removed`});
    })
})

router.get('/:ingestionClientId', (req, res) => {
    services.getIngestionClient(req.params.ingestionClientId).then((ingestionClient) => {
        res.json(ingestionClient);
    })
})

app.use('/ingestionClient', router);
app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`)
})
