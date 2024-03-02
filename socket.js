const socketIo = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
}

async function emitLocationUpdate() {
    const locations = await prisma.location.findMany({});
    if (io) {
        io.emit('locationUpdate', locations);
        console.log('Location data updated and emitted:', locations);
    } else {
        console.error('Socket.io is not initialized.');
    }
}

async function emitVehiculeUpdate() {
    const vehicules = await prisma.vehicule.findMany({});
    if (io) {
        io.emit('vehiculeUpdate', vehicules);
        console.log('Vehicule data updated and emitted:', vehicules);
    } else {
        console.error('Socket.io is not initialized.');
    }
}

async function emitUserUpdate() {
    const users = await prisma.utilisateur.findMany({});
    if (io) {
        io.emit('userUpdate', users);
        console.log('User data updated and emitted:', users);
    } else {
        console.error('Socket.io is not initialized.');
    }
}

async function emitMinLoyerUpdate(minLoyer) {
    if (io) {
        io.emit('minLoyerUpdated', minLoyer);
        console.log('MinLoyer data updated and emitted:', minLoyer);
    } else {
        console.error('Socket.io is not initialized.');
    }
}

prisma.$on('locationUpdated', () => {
    emitLocationUpdate();
});

prisma.$on('vehiculeUpdated', () => {
    emitVehiculeUpdate();
});

prisma.$on('userUpdated', () => {
    emitUserUpdate();
});

prisma.$on('minLoyerUpdated', () => {
    emitMinLoyerUpdate();
});

module.exports = {
    initializeSocket,
    emitLocationUpdate,
    emitVehiculeUpdate,
    emitUserUpdate,
};
