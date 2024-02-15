const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient;

module.exports = {
    createLocation: async (data) => prisma.location.create({data}),

    getAllLocation: async () => prisma.location.findMany({}),

    getLocationById: async (locId) => prisma.location.findUnique({
        where: {
            idLoc: parseInt(locId, 10)
        }
    }),

    updateLocation: async (locId, data) => prisma.location.update({
        where: {
            idLoc: locId,
        },
        data: {
            numLoc: data.numLoc,
            nomLoc: data.nomLoc,
            designVoiture: data.designVoiture,
            nombreJour: data.nombreJour,
            tauxJournalier: data.tauxJournalier
        }
    }),

    deleteLocation: async (locId) => prisma.location.delete({
        where: {
            idLoc: locId,
        }
    }),
};