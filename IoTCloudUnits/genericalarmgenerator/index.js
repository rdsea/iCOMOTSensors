const faker = require('faker');
const fs = require('fs');
const assert = require('assert').strict;
var ArgumentParser = require('argparse').ArgumentParser;
//one can add more
const ALARM_TYPES = [
    "FIRE",
    "POWER",
    "CHEMICAL",
    "TRAFFIC",
    "COLLISION",
    "DISASTER"
];
//one can add more
const SEVERITY = [
    "NOTICE",
    "WARNING",
    "CRITICAL"
];
//one can add more. location is based on geohash
const terminals = [
    {name: "TCV STEVEDORING COMPANY S.A.", location:"ezp8rmfcsbcg"},
    {name: "VALENCIA TERMINAL EUROPA S.A.", location: "ezpb3h3e3cqr"},
    {name: "M.S.C. TERMINAL VALENCIA S.A.U ", location: "ezpb2s85c4f7"},
    {name: "NOATUM CONTAINER TMNL.VCIA S.A", location:"ezp8r17m0hn6"},
]

var parser = new ArgumentParser({
  version: '1.0.1',
  addHelp:true,
  description: 'arguments for alarm sensor generator'
});
parser.addArgument(
  [ '-o', '--output' ],
  {
    help: 'output file'
  }
);
parser.addArgument(
  [ '-n', '--num' ],
  {
    help: 'number of entries'
  }
);

var args = parser.parseArgs();

var  output_file=args.output;
assert.ok((output_file != null) &&(typeof output_file =='string'));
var num_entry =args.num;
assert.ok (num_entry>0);


let rows = [];
rows.push(["time", "alarm_type", "alarm_severity", "location", "object_type", "object_id",])

for(let i=0;i<num_entry;i++){
    let terminal = faker.random.arrayElement(terminals)
    rows.push([faker.date.recent().toISOString(), faker.random.arrayElement(ALARM_TYPES), faker.random.arrayElement(SEVERITY), terminal.location,"TERMINAL", terminal.name]);
}


rows.forEach((row) => {
    let rowString = row.join(",")+"\n"
    fs.appendFile(output_file, rowString, function (err) {
        if (err) {
          // append failed
        } else {
          // done
        }
      })
})
