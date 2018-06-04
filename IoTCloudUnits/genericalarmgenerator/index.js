const faker = require('faker');
const fs = require('fs');


const ALARM_TYPES = [
    "FIRE",
    "POWER",
    "CHEMICAL",
    "TRAFFIC",
    "COLLISION",
    "DISASTER"
];

const SEVERITY = [
    "NOTICE",
    "WARNING",
    "CRITICAL"
];

const terminals = [
    {name: "TCV STEVEDORING COMPANY, S.A.", location:"ezp8rmfcsbcg"},
    {name: "VALENCIA TERMINAL EUROPA, S.A.", location: "ezpb3h3e3cqr"},
    {name: "M.S.C. TERMINAL VALENCIA,S.A.U ", location: "ezpb2s85c4f7"},
    {name: "NOATUM CONTAINER TMNL.VCIA S.A", location:"ezp8r17m0hn6"},
]

let rows = [];
rows.push(["time", "alarm_type", "alarm_severity", "location", "object_type", "object_id",])

for(let i=0;i<1000;i++){
    let terminal = faker.random.arrayElement(terminals)
    rows.push([faker.date.recent().toISOString(), faker.random.arrayElement(ALARM_TYPES), terminal.location,"TERMINAL", terminal.name]);
}


rows.forEach((row) => {
    let rowString = row.join(",")+"\n"
    fs.appendFile('data.csv', rowString, function (err) {
        if (err) {
          // append failed
        } else {
          // done
        }
      })
})



