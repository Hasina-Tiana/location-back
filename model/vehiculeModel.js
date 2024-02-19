const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient;

module.exports = {
    createVehicule: async (data) => prisma.vehicule.create({data}),

    getAllVehicule: async () => prisma.vehicule.findMany({}),

    getVehiculeById: async (vehiculeId) => prisma.vehicule.findUnique({
        where: {
            idVehicule: parseInt(vehiculeId, 10)
        }
    }),

    updateVehicule: async (vehiculeId, data) => prisma.vehicule.update({
        where: {
            idVehicule: vehiculeId,
        },
        data: {
            numLoc: data.numLoc,
            nomLoc: data.nomLoc,
            designVoiture: data.designVoiture,
            nombreJour: data.nombreJour,
            tauxJournalier: data.tauxJournalier
        }
    }),

    deleteVehicule: async (vehiculeId) => prisma.vehicule.delete({
        where: {
            idVehicule: vehiculeId,
        }
    }),
};