const express = require("express");
const bodyParser = require("body-parser");
const services = require("./src/services");

const PORT = 3008;
var app = express();

// middleware declaration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

router.get("/", (req, res) => {
    res.json({
        url:'/kubefw/',
        sampleConfiguration: {
            serviceName: "serviceName",
            services: [
                "service1",
                "service2"
            ],
            ips: [
                "0.0.0.0/0",
                "127.0.0.1/16"
            ],
            ports: [
                1234,
                1234
            ]
        },
    });
})

router.get('/list', (req, res) => {
    services.getFirewalls().then((firewalls) => {
        res.json(firewalls)
    })
});

router.post('/', (req, res) => {
    services.createFirewall(req.body).then((firewall) => {
        res.json(firewall)
    })
});

router.delete('/:firewallId', (req,res) => {
    services.deleteFirewall(req.params.firewallId).then(() => {
        res.json({ message: `${req.params.alarmclientId} successfully removed`});
    })
})

router.get('/:firewallId', (req, res) => {
    services.getFirewalls(req.params.firewallId).then((firewall) => {
        res.json(firewall);
    })
})

app.use('/kubefw', router);
app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`)
})