var util=require('util')
var mocker = require('mocker-data-generator').default
var emissionCabins = {
    emissionCabinId: {
      faker: 'random.number({"min": 1, "max": 100})'
    },
    name: {
        randexp: /Cabina VR-(001|002|003|004)/
    },
    portId: {
        faker: 'random.number({"min": 1, "max": 20})'
    },
    description: {
        randexp: /Ubicada en Caseta Ecoport/
    },
    latitude: {
      faker: 'random.number({"min":26, "max":27})'
    },
    longitude: {
      faker: 'random.number({"min": 18, "max": 19})'
    },
};

mocker()
    .schema('emissionCabins', emissionCabins, 6)
    .build(function(error, data) {
        if (error) {
            throw error
        }
        var valenciaport = {
          "valenciaPortData": data
        }
        //console.log(util.inspect(data, { depth: 10 }))
        //console.log(util.inspect(valenciaport, { depth: 10 }))
        console.log(JSON.stringify(valenciaport));
    })
