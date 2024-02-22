const vehiculeModel = require('../model/vehiculeModel');
const { emitVehiculeUpdate } = require('../socket');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

module.exports = {
    createVehicule: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Veuillez sélectionner une photo' });
            }
    
            const imageUrl = `${req.file.filename}`;
            const vehiculeData = req.body;
    
            vehiculeData.imgURL = imageUrl;
    
            const newVehicule = await vehiculeModel.createVehicule(vehiculeData);
    
            emitVehiculeUpdate();
            res.json(newVehicule);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },    

    getAllVehicules: async (req, res) => {
        try {
            const vehicules = await vehiculeModel.getAllVehicules();
            emitVehiculeUpdate();
            res.json(vehicules);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getVehiculeById: async (req, res) => {
        const vehiculeId = req.params.idVehicule;

        try {
            const vehicule = await vehiculeModel.getVehiculeById(vehiculeId);
            if(!vehicule) {
                return res.status(404).json({ error: 'Vehicule not found' });
            }
            emitVehiculeUpdate();
            res.json(vehicule);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateVehicule: async (req, res) => {
        const vehiculeId = parseInt(req.params.idVehicule);
        if(isNaN(vehiculeId)) {
            return res.status(400).json({ error: 'Invalid vehiculeId' });
        }

        const data = req.body;
        try {
            const updateVehicule = await vehiculeModel.updateVehicule(vehiculeId, data);
            if(!updateVehicule) {
                return res.status(400).json({ error: 'Vehicule not found' });
            }
            emitVehiculeUpdate();
            res.json(updateVehicule);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteVehicule: async (req, res) => {
        const vehiculeId = parseInt(req.params.idVehicule);
        if(isNaN(vehiculeId)) {
            return res.status(400).json({ error: 'Invalid vehiculeId' });
        }

        try {
            const deleteVehicule = await vehiculeModel.deleteVehicule(vehiculeId);
            if(!deleteVehicule) {
                return res.status(400).json({ error: 'Vehicule not found' });
            }
            emitVehiculeUpdate();
            res.json([message = 'La vehicule a bien été supprimée']);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};