import express from 'express';
import bodyParser from 'body-parser';
import * as services from './services';

var PORT = 3004;

if (process.env.PORT) {
  PORT=process.env.PORT;
}
var app = express();

// middleware declaration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

router.get('/', (req, res) => {
    res.json({
        url:'/',
        sampleConfiguration: {
        }
    });
});

router.post('/', (req, res) => {
    services.createDataTransformer(req.body).then((datatransformer) => {
        res.json(datatransformer.toJSON());
    })
});

router.get('/list', (req, res) => {
    services.getDataTransformers().then((datatransformers) => {
        res.json(datatransformers);
    })
})

router.delete('/:datatransformerId', (req,res) => {
    services.deleteDataTransformer(req.params.datatransformerId).then(() => {
        res.json({ message: `${req.params.sliceId} successfully removed`});
    })
})

router.get('/:datatransformerId', (req, res) => {
    services.getDataTransformers(req.params.datatransformerId).then((datatransformers) => {
        res.json(datatransformers);
    })
})

app.use('/datatransformer', router);
app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`)
})
