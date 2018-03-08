const fs = require('fs');
const csv = require('fast-csv');
const config = require('./config.json');
const path = require('path');


let humWritableStream = fs.createWriteStream('humidity.csv');
let genVoltWritableStream = fs.createWriteStream('genVolt.csv');
let gridLoadWritableStream = fs.createWriteStream('gridload.csv');
let batVoltWritableStream = fs.createWriteStream('batteryVoltage.csv');
let batCurrentWritableStream = fs.createWriteStream('batteryCurrent.csv');
let capacityWritableStream = fs.createWriteStream('capacity.csv');
let tempWritableStream = fs.createWriteStream('temperature.csv');

let humStream = csv.createWriteStream({headers: false});
let genVoltStream = csv.createWriteStream({headers: false});
let gridloadStream = csv.createWriteStream({headers: false});
let batVoltStream = csv.createWriteStream({headers: false});
let batCurrentStream = csv.createWriteStream({headers: false});
let capacityStream = csv.createWriteStream({headers: false});
let tempStream = csv.createWriteStream({headers: false});

humStream.pipe(humWritableStream);
genVoltStream.pipe(genVoltWritableStream);
gridloadStream.pipe(gridLoadWritableStream);
batVoltStream.pipe(batVoltWritableStream);
batCurrentStream.pipe(batCurrentWritableStream);
capacityStream.pipe(capacityWritableStream);
tempStream.pipe(tempWritableStream);

let stream = fs.createReadStream('data.csv');
let csvStream = csv().on('data', (data) => {
    switch(data[4]){
        case '115':
            humStream.write(data);
            break;
        case '116':
            tempStream.write(data);
            break;
        case '121':
            genVoltStream.write(data);
            break;
        case '122':
            gridloadStream.write(data);
        case '141':
            batVoltStream.write(data);
            break;
        case '142':
            batCurrentStream.write(data);
            break;
        case '161':
            capacityStream.write(data);
            break;
        default: return;
    }
});

stream.pipe(csvStream);

