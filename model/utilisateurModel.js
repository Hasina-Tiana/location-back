const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    createNewUser: async (data) => newUser = prisma.utilisateur.create({
        data: {
            nomUser: data.nomUser,
            prenomUser: data.prenomUser,
            numeroTelephone: data.numeroTelephone,
            numeroCIN: data.numeroCIN,
            adresse: data.adresse,
            username: data.username,
            password: data.hashedPassword,
        },
    }),

    loginUser: async (username) => {
        return await prisma.utilisateur.findUnique({
            where: {
                username: username,
            }
        });
    },

    checkUsername: async (username) => {
        return await prisma.utilisateur.findUnique({
            where: {
                username: username,
            }
        })
    },

    getAllUtilisateurs: async () => prisma.utilisateur.findMany({
        orderBy: {
            idUser: 'asc'
        }
    }),
}