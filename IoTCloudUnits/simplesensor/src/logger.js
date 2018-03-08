import winston from 'winston';

const LOG_FILE = '/tmp/sensor.log'

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: LOG_FILE}),
    ],
});

logger.info(`sensor logging all data to ${LOG_FILE}`);

export default logger;

