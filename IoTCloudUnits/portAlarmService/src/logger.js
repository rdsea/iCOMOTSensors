const winston = require('winston');

const LOG_FILE = '/tmp/ingestion.log'

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: LOG_FILE}),
    ],
});

logger.info(`ingestion client logging all data to ${LOG_FILE}`);

module.exports = logger;

