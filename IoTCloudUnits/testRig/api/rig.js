import express from 'express';
import * as rigService from '../services/rig';
import * as locatorService from '../services/locator';

var router = express.Router();


router.put('/L001/turn_locator', (req, res) => {
    res.json({ radian: locatorService.turn(req.body.radian) });
});

router.get('/L001/turn_locator', (req, res) => {
    res.json({ radian: locatorService.getLocator() });
});


// to check if device in motion
router.use('/:device', (req, res, next) => {
    if(req.params.device && req.method == 'PUT'){
        let inMotion = rigService.deviceInMotion(req.params.device);
        if(inMotion){
            res.status(400);
            res.json({ error: 'the device is in motion' });
            return;
        }
    }
    next();
});


router.get('/', (req, res) => {
    res.json(rigService.findAllDevices(req.headers.host));
});

router.get('/:device/voltage', (req, res) => {
    let volt = rigService.getDeviceField(req.params.device, 'volt');
    res.json({
        volt,
    });
});

router.put('/:device/voltage', (req, res) => {
    let volt = rigService.changeField(req.params.device, 'volt', req.body.volt);
    res.json({
        volt,
    });
});

router.get('/:device/position', (req, res) => {
    let lat = rigService.getDeviceField(req.params.device, 'lat');
    let lon = rigService.getDeviceField(req.params.device, 'lon');
    res.json({
        lat,
        lon,
    });
});

router.put('/:device/position', (req, res) => {
    let lat = rigService.changeField(req.params.device, 'lat', req.body.lat);
    let lon = rigService.changeField(req.params.device, 'lon', req.body.lon);
    res.json({
        lat,
        lon,
    })
});

router.get('/:device/heartrate', (req, res) => {
    let bpm = rigService.getDeviceField(req.params.device, 'bpm');
    res.json({
        bpm,
    });
});

router.put('/:device/heartrate', (req, res) => {
    let bpm = rigService.changeField(req.params.device, 'bpm', req.body.bpm);
    res.json({
        bpm,
    });
});

router.get('/init_devices', (req, res) => {
    rigService.initAllDevices();
    res.json({});
});

router.put('/init_devices', (req, res) => {
    rigService.initAllDevices();
    res.json({});
});

router.get('/:device', (req, res) => {
    res.json(rigService.findDevice(req.params.device, req.headers.host));
});

router.get('/:device/move', (req, res) => {
    res.json({ in_motions: rigService.deviceInMotion(req.params.device)});
})

router.put('/:device/move', (req, res) => {
    res.json(rigService.moveDevice(req.params.device, req.body.direction.x, req.body.speed.x, req.body.duration));
});

router.get('/:device/distance', (req, res) => {
    res.json(rigService.getDistanceOptions(req.params.device, 'rig', req.headers.host));
});

router.put('/:device/distance/:otherDevice', (req, res) => {
    res.json(rigService.setDistanceBetween(req.params.device, req.params.otherDevice, req.body.distance));
});

export default router;
