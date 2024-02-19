const express = require('express');
const router = express.Router();
const vehiculeController = require('../controller/vehiculeController');

router.get('/getAllVehicules', vehiculeController.getAllVehicules);
router.get('/getVehiculeById/:idVehicule', vehiculeController.getVehiculeById);
router.post('/createVehicule', vehiculeController.createVehicule);
router.put('/updateVehicule/:idVehicule', vehiculeController.updateVehicule);
router.delete('/deleteVehicule/:idVehicule', vehiculeController.deleteVehicule);

module.exports = router;