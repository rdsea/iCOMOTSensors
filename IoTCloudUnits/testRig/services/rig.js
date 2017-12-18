import * as dao from '../data/devices';
import Device from '../data/devices'

export function changeField(id, field, value){
    if(!isNaN(value)) value = parseFloat(value);
    let device = dao.find(id);
    device[field] = value;
    dao.saveDevice(device);
    return device[field];
}

export function getDeviceField(id, field){
    let device = dao.find(id);
    return device[field];
}

export function findAllDevices(){
    let res = []
    let devices = dao.findAll();

    devices.forEach((device) => {
        res.push(device.toJson());
    });
    return res;
}

export function findDevice(id){
    return dao.find(id).toJson();
}

export function moveDevice(id, direction, speed, duration){
    let device = dao.find(id);
    device.move(direction, speed, duration);
    return { lat: device.lat, lon: device.lon };
}

export function deviceInMotion(id){
    return dao.find(id).isMoving();
}

export function initAllDevices(){
    let devices = dao.findAll();
    devices.forEach((device) => {
        changeField(device.device, 'lat', 0.0);
        changeField(device.device, 'lon', 0.0);
    })
}

export function getDistanceOptions(id, api){
    let res = {};
    let devices = dao.findAll();
    devices.forEach((device) => {
        if(device.device === id) return;         
        res[device.device] = `http://framework-utest.nordicmedtest.se/${api}/${id}/distance/${device.device}`;
    });
    return res;
}

export function setDistanceBetween(deviceId1, deviceId2, distance){
    distance = parseFloat(distance);
    let distanceToMove = distance/4;
    let device1 = dao.find(deviceId1);
    let device2 = dao.find(deviceId2); 
    
    Device.setDistanceBetween(device1, device2, distance);
    dao.saveDevice(device1);
    dao.saveDevice(device2);
    return { distance };
}

export function getDistanceBetween(deviceId1, deviceId2){
    let device1 = dao.find(deviceId1);
    let device2 = dao.find(deviceId2);
    return Device.getDistanceBetween(device1, device2);
}

function movingErrorHandler (err, req, res, next) {
    res.status(500)
    res.render('error', { error: err })
}


