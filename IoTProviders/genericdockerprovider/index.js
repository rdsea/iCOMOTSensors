const express = require("express");
const bodyParser = require("body-parser");
const services = require("./src/services");

const PORT = 3009;
var app = express();

// middleware declaration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var router = express.Router();

router.get("/", (req, res) => {
    res.json({
        sampleConfiguration: {
            image: "image name",
            ports: [
                3000,
                3001
            ],
            environment:[
                {
                    name: "ENV_NAME",
                    value: "variable"
                },
            ],
            files:[
                {
                    name: "name",
                    path: "/path/to/mount",
                    body: "the content of the file here"
                }
            ],
            args:"list of arguments"
        }


    })
})

router.post("/", (req, res) => {
    services.createService(req.body).then((service) => {
        res.json(service);
    }).catch((err) => {
        res.status(400).send(err);
    });
})

router.get("/list", (req, res) => {
    services.getAllServices().then((services) => {
        res.json(services);
    }).catch((err) => {
        res.status(400).send(err);
    });
})
router.get("/images", (req, res) => {
    services.getAllImages().then((services) => {
        res.json(services);
    }).catch((err) => {
        res.status(400).send(err);
    });
})

router.delete("/:serviceId", (req, res) => {
    services.deleteService(req.params.serviceId).then(() => {
        res.json({message: "successfully deleted"});
    }).catch((err) => {
        res.status(400).send(err);
    });
})

router.get("/:serviceId", (req, res) => {
    services.getService(req.params.serviceId).then((service) => {
        res.json(service)
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.use('/docker', router);
app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`)
})
