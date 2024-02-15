const express = require('express');
const router = express.Router();
const locationController = require('../controller/locationController');

router.get('/getAllLocation', locationController.getAllLocation);
router.get('/getLocationById/:idLoc', locationController.getLocationById);
router.post('/createLocation', locationController.createLocation);
router.put('/updateLocation/:idLoc', locationController.updateLocation);
router.delete('/deleteLocation/:idLoc', locationController.deleteLocation);

module.exports = router;