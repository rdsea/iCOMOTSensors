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

function registerCrane(crane){
    return db.insert(crane)
}
function findAllCranes(){
    return db.find({});
}
function findTrucksInPort(craneId){
  let query = {
      craneId
  }
  return db.find(query)
}
//TODO find cranes with geohash

module.exports = {
    registerVessel,
    findVesselsInTerminal,
    findAllVessels,
    registerTruck,
    findAllTrucks,
    findTrucksInPort,
    registerCrane,
    findAllCranes
}
