const yml = require("js-yaml");
const fs = require("fs");
const chai = require('chai');
chai.use(require('chai-fs'))
chai.expect('config.yml').to.be.a.path("the configuration file must exist");
let doc = {};
try {
    doc = yml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
    console.log(doc);
} catch (e) {
    console.log("failed to load config")
    console.log(e);
}

module.exports = doc
