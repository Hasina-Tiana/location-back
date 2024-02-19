const socketIo = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

let io;

function initializeSocket(server) {
    io = socketIo(server);

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

module.exports = {
    initializeSocket,
    emitLocationUpdate,
};