import BigQuery from '@google-cloud/bigquery';
import path from 'path';

let bigQuery = BigQuery({
    keyFilename: path.join(__dirname, '../keyfile.json'),
})

export default bigQuery;