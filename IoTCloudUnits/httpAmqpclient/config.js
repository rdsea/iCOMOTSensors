const yml = require("js-yaml");
const fs = require("fs");

let doc = {};
try {
    doc = yml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
    console.log(doc);
} catch (e) {
    console.log("failed to load config")
    console.log(e);
}

module.exports = doc