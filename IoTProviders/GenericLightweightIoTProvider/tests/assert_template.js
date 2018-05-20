var expect = require('chai').expect;
import  deployTemplate from '../configTemplates/deployTemplate';
import GLIoTFunction from '../data/models/gliotfunction';

var gliotFunctions = JSON.parse(JSON.stringify(deployTemplate));
expect(gliotFunctions.functions).to.have.lengthOf(3);
expect(gliotFunctions.functions[0].functionname).to.be.a('string');
console.log("Nothing is wrong until now");
