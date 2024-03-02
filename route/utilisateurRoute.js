const express = require('express');

const router = express.Router();

const utilisateurController = require('../controller/utilisateurController');

// POST
router.post('/createUser', utilisateurController.createNewUser);
router.post('/auth', utilisateurController.loginUser);

// GET
router.get('/checkUsername/:username', utilisateurController.checkUsername);
router.get('/getAllUtilisateurs', utilisateurController.getAllUtilisateurs);
router.get('/getUtilisateurById/:idUser', utilisateurController.getUtilisateurById);

// PUT
router.put('/updatePassword/:idUser/updatePassword', utilisateurController.updatePassword);

// DELETE
router.delete('/deleteUser/:idUser', utilisateurController.deleteUser);

module.exports = router;
