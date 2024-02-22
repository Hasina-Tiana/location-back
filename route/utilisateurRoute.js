const express = require('express');

const router = express.Router();

const utilisateurController = require('../controller/utilisateurController');

// POST
router.post('/createUser', utilisateurController.createNewUser);
router.post('/auth', utilisateurController.loginUser);

// GET
router.get('/checkUsername/:username', utilisateurController.checkUsername);
router.get('/getAllUtilisateurs', utilisateurController.getAllUtilisateurs);

module.exports = router;
