const db = require("./data/db");

function registerVessel(vessel){
    return db.insert(vessel)
}

function findAllVessels(){
    return db.find({});
}

function findVesselsInTerminal(terminal){
    let query = {
        terminal
    }
    return db.find(query)
}

module.exports = {
    registerVessel,
    findVesselsInTerminal,
    findAllVessels
}