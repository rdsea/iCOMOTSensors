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
        url:'/testrig/',
        sampleConfiguration: {
            sliceId: 'mySliceId',
        }
    });
});

router.post('/', (req, res) => {
    services.createTestRig(req.body).then((testrig) => {
        res.json(testrig.toJSON());
    })
});

router.delete('/:sliceId', (req,res) => {
    services.deleteTestrig(req.params.sliceId).then(() => {
        res.json({ message: `${req.params.sliceId} successfully removed`});
    })
})

router.get('/:sliceId', (req, res) => {
    services.getTestrigs(req.params.sliceId).then((testrigs) => {
        res.json(testrigs);
    })
})

app.use('/testrig', router);
app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`)
})
