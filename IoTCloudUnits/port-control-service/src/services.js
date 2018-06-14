const db = require("./data/db");

function registerVessel(vessel){
    return db.insert(vessel)
}

function findAllVessels(){
    return db.find({});
}

function findVesselsInTerminal(terminal){
    let query = {
        "Terminal":terminal
    }
    return db.find(query)
}
function registerTruck(truck){
    return db.insert(truck)
}
function findAllTrucks(){
    return db.find({});
}
function findTrucksInPort(licensePlate){
  let query = {
      licensePlate
  }
  return db.find(query)
}
module.exports = {
    registerVessel,
    findVesselsInTerminal,
    findAllVessels,
    registerTruck,
    findAllTrucks,
    findTrucksInPort
}
