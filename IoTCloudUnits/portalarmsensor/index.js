const mqtt = require('mqtt');
const config = require('./config');

var sleep = require('sleep');
//one sensor connect to only one broker
console.log(config);
let client = mqtt.connect(config.alarmBroker);
var util=require('util')
//to be defined as an input parameter
var number_of_alarms=100;
var mocker = require('mocker-data-generator').default
const list_of_alarm_types=["POWER","CHEMICAL","FIRE","TRAFFIC"];
//terminal from the port can be found from https://www.valenciaportpcs.net/portcalls/Search
const list_of_ports=["CIA. TRASMEDITERRANEA, S.A.",
"EUROLINEAS MARITIMAS S.A.",
"M.S.C. TERMINAL VALENCIA,S.A.U",
"NOATUM CONTAINER TMNL.VCIA S.A",
"TCV STEVEDORING COMPANY, S.A.",
"TEMAGRA S.L.",
"TERMINALES PORTUARIAS, S.L.",
"VALENCIA TERMINAL EUROPA, S.A."
]
var alarmgenerator = {
    alarm: {
    alarm_type: {
      function: function() {
                return this.faker.random.arrayElement(list_of_alarm_types)
              }
    },
    terminal: {
      function: function() {
                return this.faker.random.arrayElement(list_of_ports)
        }
    },
    event_time: {
        function: function() {
          //return seconds from epoch UTC
          return Date.now()/1000;
        }
    },
    //the lat,long are based on a simple space of valencia port
    //it is very related by taking location info from Google Map
    latitude: {
      function: function() {
        return Math.random()* (39.4527899- 39.4527899) + 39.4527899;
      }
    },
    longitude: {
      function: function() {
        return Math.random()* (0.3339427-0.3339427) - 0.3339427;
      }
    }
  }
};


//connect to the alarm broker
client.on('connect', () => {
  console.log("Alarm broker connected");
  console.log("Publish a test to "+config.topic.name);
})
  //wait and randommly send alarms

client.publish(config.topic.name,"{test:0}");

    //depending on the paramenter we will create different events
    mocker()
      .schema('alarm', alarmgenerator,number_of_alarms)
      .build(function(error, data) {
          if (error) {
            throw error
        }
        for (i=0; i < 100; i++) {
        console.log(JSON.stringify(data.alarm[i]));
        console.log("Pulish to " + config.topic.name)
        client.publish(config.topic.name, JSON.stringify(data.alarm[i]));
        sleep.sleep(60);
      }
    })

  client.on('error', function(err) {
      console.log(`error occurred in client ${client.clientId}`);
      console.log(err.message);
  });

  client.on('close', () => {
      console.log(`disconnected client no longer ingesting from ${config.topic.name}`);
  })
