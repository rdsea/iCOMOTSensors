import axios from 'axios';
import logger from '../logger';

export default function output(payload, uri){

    let isJSON = true;
    // check if json
    try{
        JSON.parse(payload);
    }catch(e){
        isJSON = false;
    }
    
    logger.info(payload);
    return axios.post(uri, payload, {
        headers: { 'Content-Type': isJSON ? 'application/json' : 'text/plain'},
    }).then((res) => {
        logger.info(`payload successfully sent to ${uri}`)
    }).catch((err) => {
        logger.error(`failed to send payload`);
        logger.error(err.message);
    });
}