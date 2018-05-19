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
        url:'/gliot/',
        sampleConfiguration: {
          'message':'just a generic lightweight iot provider'
        }
    });
});

router.post('/', (req, res) => {
    services.createGLIoTFunction(req.body).then((gliotfunction) => {
        res.json(gliotfunction.toJSON());
    })
});

router.get('/list', (req, res) => {
    services.getGLIoTFunctions().then((gliotfunctions) => {
        res.json(gliotfunctions);
    })
})

router.delete('/:gliotId', (req,res) => {
    services.deleteGLIoTFunction(req.params.gliotId).then(() => {
        res.json({ message: `${req.params.gliotId} successfully removed`});
    })
})

router.get('/:gliotId', (req, res) => {
    services.getGLIoTFunctions(req.params.gliotId).then((gliotfunctions) => {
        res.json(gliotfunctions);
    })
})

app.use('/gliot', router);
app.listen(PORT, () => {
    console.log(`GLIoTProvider listening at port ${PORT}`)
})
