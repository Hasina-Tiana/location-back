const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient;

module.exports = {
    createVehicule: async (data) => prisma.vehicule.create({
        data: {
            nomVehicule: data.nomVehicule,
            details: data.details,
            tauxJournalier: parseInt(data.tauxJournalier),
            imgURL: data.imgURL,
        },
    }),

    getAllVehicules: async () => prisma.vehicule.findMany({
        orderBy: {
            idVehicule: 'asc'
        }
    }),

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
            nomVehicule: data.nomVehicule,
            details: data.details,
            tauxJournalier: parseInt(data.tauxJournalier),
            imgURL: data.imgURL,
        }
    }),

    deleteVehicule: async (vehiculeId) => prisma.vehicule.delete({
        where: {
            idVehicule: vehiculeId,
        }
    }),
};