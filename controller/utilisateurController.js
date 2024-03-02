const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const utilisateurModel = require('../model/utilisateurModel');
const { PrismaClient } = require("@prisma/client");
const { emitUserUpdate } = require('../socket');
const prisma = new PrismaClient();

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

            emitUserUpdate();
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
    },

    getAllUtilisateurs: async (req, res) => {
        try {
            const utilisateurs = await utilisateurModel.getAllUtilisateurs();
            emitUserUpdate();
            res.json(utilisateurs);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updatePassword: async (req, res) => {
        const userId = parseInt(req.params.idUser);
        const { password } = req.body;
        
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const updatedUser = await prisma.utilisateur.update({
                where: {
                    idUser: userId
                },
                data: {
                    password: hashedPassword
                }
            });
    
            emitUserUpdate();
            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getUtilisateurById: async (req, res) => {
        const userId = req.params.idUser;

        try {
            const user = await utilisateurModel.getUtilisateurById(userId);
            if(!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            emitUserUpdate();
            res.json(user);
        } catch(error) {
            res.status(500).json({ error: error.message })
        }
    },

    deleteUser: async(req, res) => {
        const userId = req.params.idUser;
        if(isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid userId' });
        }

        try {
            const delUser = await utilisateurModel.deleteUser(userId);
            if(!delUser) {
                return res.status(400).json({ error: 'User not found' });
            }
            emitUserUpdate();
            res.json(delUser);
        } catch(error) {
            res.status(500).json({ error: error.message });
        }
    }
}