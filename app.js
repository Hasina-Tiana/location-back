const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use(bodyParser.json());

const apiRouteLocation = require('./route/locationRoute');
const apiRouteUtilisateur = require('./route/utilisateurRoute');
const apiRouteVehicule = require('./route/vehiculeRoute');

app.use('/api', apiRouteLocation);
app.use('/api', apiRouteUtilisateur);
app.use('/api', apiRouteVehicule);

const server = http.createServer(app);

const { initializeSocket } = require('./socket');
initializeSocket(server);

server.listen(port, () => {
    console.log(`Le serveur API écoute sur le port ${port}`);
});
