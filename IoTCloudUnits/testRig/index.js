import express from 'express';
import bodyParser from 'body-parser';

import rig from './api/rig';
import sut from './api/sut';

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/rig', rig);
app.use('/sut', sut);

app.listen(3000, () => {
    console.log('server listening on port 3000');
})
