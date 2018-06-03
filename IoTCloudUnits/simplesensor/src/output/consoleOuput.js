import logger from '../logger';

export default function output(payload, uri){
    console.log(payload);
    return new Promise((resolve, reject) => resolve())
}