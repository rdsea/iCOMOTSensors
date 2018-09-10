const config = require('./config.js');
const router = require('./router');
const express = require("express");
const app = express();

/*const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./main/openapi/openapi3.yaml');*/

const PORT = config.SERVER_PORT;

//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/datastorageArtefact', router);
//app.use(bodyParser.json());

app.listen(PORT);
//console.log(`Running on http://localhost:${PORT}/api-docs`);
