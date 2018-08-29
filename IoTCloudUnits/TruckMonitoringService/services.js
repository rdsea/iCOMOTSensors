
import randomstring from 'randomstring';
import { randomBytes } from 'crypto';
import TruckInfo from './data/models/truckinfo';
const HashMap = require('hashmap');
var truckmap = new HashMap();
const {promisify} = require('util');

const amqp = require('amqplib');
var chai = require('chai')
  , expect = chai.expect
  , should = chai.should();
chai.use(require('chai-url'));

function updateTruckInfo(license,isEntered){
  console.log("Update truck info");
    //something is wrong
    if (isEntered == true) {
      let truck = new TruckInfo({
        license:license,
        isEntered:isEntered,
        inport:true,
      });
      console.log("New truck entered "+license);
      truckmap.set(license,truck);
      return truck.save();
    }
  else {
    let truck = truckmap.get(license);
    if (truck != null) {
    deleteTruck(license);
  }
  }
}

function deleteTruck(license){
    let query = {
        license,
    };
    return TruckInfo.findOneAndRemove(license).then(() => {
        let truck = truckmap.get(license);
        if (truck == null)
          return;
        console.log("Truck exited "+license);
        truckmap.delete(license);
  });
}

export function processingData(config){
  let amqp_uri =config.amqp_uri;
  let amqp_queue =config.amqp_queue;
  expect(amqp_uri).to.have.protocol("amqp");
  let connection = null;
  let channel = null;
  console.log(`connecting to amqp broker at ${amqp_uri}`);
  amqp.connect(amqp_uri).then((conn) => {
      console.log("successfully conencted");
      connection = conn;
      console.log('creating new channel');
      return connection.createChannel();
  }).then((ch) => {
      channel = ch;
      return channel.assertQueue(amqp_queue);
  }).then(function(ok) {
        return channel.consume(amqp_queue, function(msg) {
          if (msg !== null) {
            channel.ack(msg);
            var entry =JSON.parse(msg.content);
            //console.log(entry);
              if (entry["valenciaPortData"]['entryVehicles'] !=null) {
                 console.log("Get enter "+entry["valenciaPortData"]['entryVehicles'][0]['plate']);
                  return updateTruckInfo(entry["valenciaPortData"]['entryVehicles'][0]['plate'],true);
                }
              else if (entry["valenciaPortData"]['exitVehicles'] !=null) {
                console.log("Get exit "+entry["valenciaPortData"]['exitVehicles'][0]['lprPlate']);
                return updateTruckInfo(entry["valenciaPortData"]['exitVehicles'][0]['lprPlate'],false);

              }
            }
        });
  });

}



export function getTruckInfos(license){
    let query ={};
    if(license!=null) {
      query.license=license;
    }
    return TruckInfo.find(query).then((truckinfos) => {
        return truckinfos;
     });
   }
