import { setTimeout } from "timers";
import util from 'util';
import { testDevices } from './testData';

// where all the objects are instantiated
var devices = [];

Math.degrees = function(rad){
    return rad*(180/Math.PI);
}

Math.radians = function(deg){
    return deg * (Math.PI/180);
}



export function find(id){
    for(let i=0;i<devices.length;i++){
        if(devices[i].device === id){
            return devices[i];
        }
    }
}

export function saveDevice(device){
    for(let i=0;i<devices.length;i++){
        if(devices[i].device === device){
            devices[i] = device;
            return devices[i];
        }
    }
    return device;
}

export function findAll(){
    return devices;
}



/**
 * device model
 */

export default class Device{
    constructor(data){
        this.device = data.device;
        this.distace = data.distance;
        this.bpm = data.bpm;
        this.volt = data.volt;
        this.lat = data.lat;
        this.lon = data.lon;
        this.moves = data.moves
    }

    static setDistanceBetween(device1, device2, distance){  
        let x1 = device1.lat;
        let x2 = device2.lat;
        let y1 = device1.lon;
        let y2 = device2.lon;
        let a = x2 - x1;
        let b = y2 - y1;
        let dist = Math.sqrt(a*a + b*b);

        let distanceVector = { x: a, y: b };
        let unitVector = { x: distanceVector.x/dist, y: distanceVector.y/dist};
        let magnitude = (dist-distance)/2 // the distance that each device must move through the unit vector
        
        device1.lat = device1.lat + (unitVector.x*magnitude);
        device1.lon = device1.lon + (unitVector.y*magnitude);
        // opposite direction for second device
        device2.lat = device2.lat - (unitVector.x*magnitude);
        device2.lon = device2.lon - (unitVector.y.magnitude);        
    }

    isMoving(){
        if(this.moves.length > 0){
            let latest = this.moves[this.moves.length - 1];
            let currentTimestamp = (new Date()).getTime();
            console.log(currentTimestamp, latest.timestamp);
            return currentTimestamp <= latest.timestamp + latest.duration*1000;
        }

        return false;
    }

    move(direction, speed, duration){
        let setTimeoutp = util.promisify(setTimeout);
        setTimeoutp(duration*1000).then(() => {
            this.lat = this.lat + (Math.cos(direction)*speed*duration);
            this.lon = this.lon + (Math.sin(direction)*speed*duration);
        });
        this.moves.push({
            timestamp: (new Date()).getTime(),
            duration: duration,
            speed: speed,
        });
    }

    toJson(){
        return{
            device_type: 'rig device',
            distance:{
                url: `http://framework-utest.nordicmedtest.se/rig/${this.device}/distance/`,
            },
            in_motion: this.isMoving(),
            heartrate: {
                url: `http://framework-utest.nordicmedtest.se/rig/${this.device}/heartrate/`,
            },
            id: this.device,
            move: {
                url: `http://framework-utest.nordicmedtest.se/rig/${this.device}/move/`,
            },
            position: {
                url: `http://framework-utest.nordicmedtest.se/rig/${this.device}/position`,
            },
            url: `http://framework-utest.nordicmedtest.se/rig/${this.device}/`,
            voltage:{
                url: `http://framework-utest.nordicmedtest.se/rig/${this.device}/`,
            },
            
        }
    }
}

testDevices.forEach((device, index, array) => {
    device = new Device(device);
    devices.push(device);
});

