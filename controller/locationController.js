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

            const lastLocation = await prisma.location.findFirst({
                orderBy: { idLoc: 'desc' },
                select: { numLoc: true }
            });

            let nextNumLoc = 'LOC0001';

            if (lastLocation) {
                const lastNumLoc = lastLocation.numLoc;
                const lastNum = parseInt(lastNumLoc.substring(3));
                const nextNum = lastNum + 1;
                nextNumLoc = `LOC${nextNum.toString().padStart(4, '0')}`;
            }

            locationData.numLoc = nextNumLoc;

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
        const locationData = req.body;

        const vehicule = await prisma.vehicule.findUnique({
            where: { idVehicule: locationData.vehiculeId }
        });
        const locationId = parseInt(req.params.idLoc);
        if (isNaN(locationId)) {
            return res.status(400).json({ error: 'Invalid locationId' });
        }

        const { dateDepart, dateArrivee, vehiculeId } = req.body;
        const nombreJour = differenceInDays(new Date(dateArrivee), new Date(dateDepart));
        const loyer = nombreJour * vehicule.tauxJournalier;

        const data = {
            dateDepart,
            dateArrivee,
            nombreJour,
            loyer,
            vehiculeId,
        };

        try {
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
    },

    getMinLoyer: async (req, res) => {
        try {
            const minLoyer = await prisma.location.findFirst({
                orderBy: { loyer: 'asc' },
                select: { loyer: true }
            });
            emitLocationUpdate();
            res.json(minLoyer);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getMaxLoyer: async (req, res) => {
        try {
            const maxLoyer = await prisma.location.findFirst({
                orderBy: { loyer: 'desc' },
                select: { loyer: true }
            });
            emitLocationUpdate();
            res.json(maxLoyer);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getTotalLoyers: async (req, res) => {
        try {
            const totalLoyers = await prisma.location.aggregate({
                _sum: { loyer: true }
            });
            emitLocationUpdate();
            res.json(totalLoyers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};