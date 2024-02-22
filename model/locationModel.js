const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient;

module.exports = {
    createLocation: async (data) => {
        return prisma.location.create({
            data: {
                numLoc: data.numLoc,
                nomLoc: data.nomLoc,
                dateDepart: data.dateDepart,
                dateArrivee: data.dateArrivee,
                nombreJour: parseInt(data.nombreJour),
                loyer: parseInt(data.loyer),
                tauxJournalier: data.tauxJournalier,
                utilisateur: {
                    connect: { idUser: data.userId }
                },
                vehicule: {
                    connect: { idVehicule: data.vehiculeId }
                }
            }
        });
    },

    getAllLocation: async () => {
        return prisma.location.findMany({
            orderBy: {
                idLoc: 'asc'
            }
        });
    },    

    getLocationById: async (locId) => prisma.location.findUnique({
        where: {
            idLoc: parseInt(locId, 10)
        }
    }),

    updateLocation: async (locId, data) => {
        return prisma.location.update({
            where: {
                idLoc: locId,
            },
            data: {
                numLoc: data.numLoc,
                nomLoc: data.nomLoc,
                dateDepart: data.dateDepart,
                dateArrivee: data.dateArrivee,
                nombreJour: data.nombreJour,
                tauxJournalier: data.tauxJournalier,
                utilisateur: {
                    connect: { idUser: data.userId }
                },
                vehicule: {
                    connect: { idVehicule: data.vehiculeId }
                }
            }
        });
    },

    deleteLocation: async (locId) => prisma.location.delete({
        where: {
            idLoc: locId,
        }
    }),
};