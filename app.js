const express = require('express');
const bodyParser = require('body-parser');

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

app.use('/api', apiRouteLocation);

app.listen(port, () => {
    console.log(`Le serveur API écoute sur le port ${port}`);
});