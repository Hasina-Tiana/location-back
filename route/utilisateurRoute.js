const express = require('express');

const router = express.Router();

const utilisateurController = require('');

// POST
router.post('/createUser', utilisateurController.createNewUser);
router.post('/auth', utilisateurController.loginUser);

// GET
router.get('/checkUsername/:username', utilisateurController.checkUsername);

module.exports = router;
