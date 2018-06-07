const fs = require("fs");

/**
 * This script takes the one day data and transforms it into separate
 * csv files with their respective data types: weather, emission, sound
 */


const rawData = require(process.argv[2]);


let weather = [];
let sound = [];
let emission = [];

rawData.forEach((item) => {
    if(item.valenciaPortData.weatherMeasurements){
        weather.push(item.valenciaPortData.weatherMeasurements[0])
    }

    if(item.valenciaPortData.soundMeasurements){
        sound.push(item.valenciaPortData.soundMeasurements[0])
    }

    if(item.valenciaPortData.emissionMeasurements){
        emission.push(item.valenciaPortData.emissionMeasurements[0])
    }
});

let weathercsv = [];
let soundcsv = [];
let emissioncsv = [];


weathercsv.push(Object.keys(weather[0]))
soundcsv.push(Object.keys(sound[0]));
emissioncsv.push(Object.keys(emission[0]))

weather.forEach((item) => {
    weathercsv.push(Object.values(item));
})

sound.forEach((item) => {
    let row = [];
    for(label in item){
        row.push(item[label]);
    }
    soundcsv.push(Object.values(item));
})

emission.forEach((item) => {
    let row = [];
    for(label in item){
        row.push(item[label]);
    }
    emissioncsv.push(Object.values(item));
});

var weatherfile = fs.createWriteStream('valencia-weather.csv');
weatherfile.on('error', function(err) { /* error handling */ });
weathercsv.forEach(function(v) { weatherfile.write(v.join(', ') + '\n'); });
weatherfile.end();

var soundfile = fs.createWriteStream('valencia-sound.csv');
soundfile.on('error', function(err) { /* error handling */ });
soundcsv.forEach(function(v) { soundfile.write(v.join(', ') + '\n'); });
soundfile.end();

var emissionfile = fs.createWriteStream('valencia-emission.csv');
emissionfile.on('error', function(err) { /* error handling */ });
emissioncsv.forEach(function(v) { emissionfile.write(v.join(', ') + '\n'); });
emissionfile.end();






 