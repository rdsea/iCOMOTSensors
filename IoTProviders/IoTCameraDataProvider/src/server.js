import express from 'express';
import bodyParser from 'body-parser';
import routes from './api/routes/routes';

let app = express(),
  port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());


routes(app);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('API server start at port: ' + port);
