const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient;
const locationModel = require('../model/locationModel');
const { emitLocationUpdate } = require('../socket');
const { differenceInDays } = require('date-fns');

module.exports = {
    createLocation: async (req, res) => {
        try {
            const locationData = req.body;
            const vehicule = await prisma.vehicule.findUnique({
                where: { idVehicule: locationData.vehiculeId }
            });

            const nombreJour = differenceInDays(new Date(locationData.dateArrivee), new Date(locationData.dateDepart));

            const loyer = nombreJour * vehicule.tauxJournalier;

            locationData.nombreJour = nombreJour;
            locationData.loyer = loyer;

            const newLocation = await locationModel.createLocation(locationData);
            emitLocationUpdate();
            res.json(newLocation);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getAllLocation: async (req, res) => {
        try {
            const locations = await locationModel.getAllLocation();
            emitLocationUpdate();
            res.json(locations);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getLocationById: async (req, res) => {
        const locationId = req.params.idLoc;

        try {
            const location = await locationModel.getLocationById(locationId);
            if (!location) {
                return res.status(404).json({ error: 'Location not found' });
            }
            emitLocationUpdate();
            res.json(location);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateLocation: async (req, res) => {
        const locationId = parseInt(req.params.idLoc);
        if (isNaN(locationId)) {
            return res.status(400).json({ error: 'Invalid locationId' });
        }

        const data = req.body;
        try {
            data.loyer = data.nombreJour * data.vehicule.tauxJournalier;
            const updateLocation = await locationModel.updateLocation(locationId, data);
            if (!updateLocation) {
                return res.status(400).json({ error: 'Location not found' });
            }
            emitLocationUpdate();
            res.json(updateLocation);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteLocation: async (req, res) => {
        const locationId = parseInt(req.params.idLoc);
        if (isNaN(locationId)) {
            return res.status(400).json({ error: 'Invalid locationId' });
        }

        try {
            const deleteLocation = await locationModel.deleteLocation(locationId);
            if (!deleteLocation) {
                return res.status(400).json({ error: 'Location not found' });
            }
            emitLocationUpdate();
            res.json([message = 'La location a bien été supprimée']);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};