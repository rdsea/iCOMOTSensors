const yml = require("js-yaml");
const fs =require("fs");
let config = null;
try {
    config = yml.safeLoad(fs.readFileSync("./config.yml", 'utf8'));
} catch (e) {
  console.log(e);
}
module.exports = config;
