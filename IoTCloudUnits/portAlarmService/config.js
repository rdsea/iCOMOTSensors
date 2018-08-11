const yml = require("js-yaml");
const fs = require("fs");
const logger = require("./src/logger");


let config = null;
try {
    config = yml.safeLoad(fs.readFileSync("config.yml", 'utf8'));
    logger.info("configuration accepted")
    logger.info(config);
} catch (e) {
    logger.error("failed to parse config !");
    logger.error(e);
}

module.exports = config;

  