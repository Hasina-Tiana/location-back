const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utilisateurModel = require('../model/utilisateurModel');

function generateToken(user) {
    const payload = {
        userId: user.idUser,
        username: user.username,
    };

    const token = jwt.sign(payload, 'votre_cle_secrete', { expiresIn: '3h' });

    return token;
}

module.exports = {
    createNewUser: async (req, res) => {
        try {
            const { 
                nomUser,
                prenomUser,
                numeroTelephone,
                numeroCIN,
                adresse,
                username,
                password, 
            } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await utilisateurModel.createNewUser({
                nomUser,
                prenomUser,
                numeroTelephone,
                numeroCIN,
                adresse,
                username,
                hashedPassword,
            });

            res.json(newUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    loginUser: async (req, res) => {
        try {
            const { username, password } = req.body;

            const user = await utilisateurModel.loginUser(username);

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: 'Identifiants invalides' });
            }

            const token = generateToken(user);

            res.json({
                token,
                idUser: user.idUser,
                username: user.username
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    checkUsername: async (req, res) => {
        const username = req.params.username;
        try {
            const checkName = await utilisateurModel.checkUsername(username);
            res.json(checkName);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}