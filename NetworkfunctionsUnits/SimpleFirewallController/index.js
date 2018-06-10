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
        url:'/firewallcontroller/',
        sampleConfiguration: {
          "system_id":"test1",
          "google_project": "inter-hinc",
          "google_service_credential":"74a820857566.json"
        }
    });
});

router.post('/', (req, res) => {
    services.createFirewallController(req.body).then((firewallcontroller) => {
        res.json(firewallcontroller.toJSON());
    })
});

router.get('/list', (req, res) => {
    services.getFirewallController().then((firewallcontrollers) => {
        res.json(firewallcontrollers);
    })
})
router.get('/:firewallcontrollerId', (req, res) => {
    services.getFirewallController(req.params.firewallcontrollerId).then((firewallcontrollers) => {
        res.json(firewallcontrollers);
    })
})
router.delete('/:firewallcontrollerId', (req,res) => {
    services.deleteFirewallController(req.params.firewallcontrollerId).then(() => {
        res.json({ message: `${req.params.sliceId} successfully removed`});
    })
})


app.use('/firewallcontroller', router);
app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`)
})
