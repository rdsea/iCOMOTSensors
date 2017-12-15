import express from 'express';

import * as rigService from '../services/rig';

var router = express.Router();

router.get('/:device/position', (req, res) => {
    res.json({
        lat: rigService.getDeviceField(req.params.device, 'lat'),
        lon: rigService.getDeviceField(req.params.device, 'lon'),
        height: 10,
        acccuracy: 10,
    });
});

router.get('/:device/heartrate', (req,res) => {
    res.json({ bpm: rigService.getDeviceField(req.params.device, 'bpm') });
});

router.get('/:device/distance/', (req,res) => {
    res.json(rigService.getDistanceOptions(req.params.device, 'sut'));
});

router.get('/:device/distance/:otherDevice' ,(req, res) => {
    res.json({
        distance: rigService.getDistanceBetween(req.params.device, req.params.otherDevice)
    });
});

router.get('/:device/voltage', (req,res) => {
    res.json({ volt: rigService.getDeviceField(req.params.device, 'volt') });
});

router.get('/reboot_system', (req, res) => {
    res.json({});
})

router.put('/reboot_system', (req, res) => {
    res.json({});
})

export default router;
