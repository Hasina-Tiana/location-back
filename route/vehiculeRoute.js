const express = require('express');
const router = express.Router();
const vehiculeController = require('../controller/vehiculeController');
const upload = require('../mutler');


router.get('/getAllVehicules', vehiculeController.getAllVehicules);
router.get('/getVehiculeById/:idVehicule', vehiculeController.getVehiculeById);
router.post('/createVehicule', upload.single('imgURL'), vehiculeController.createVehicule);
router.put('/updateVehicule/:idVehicule', vehiculeController.updateVehicule);
router.delete('/deleteVehicule/:idVehicule', vehiculeController.deleteVehicule);

module.exports = router;