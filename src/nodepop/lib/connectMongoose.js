'use strict';
const Mongoose = require('mongoose');

Mongoose.connection.on('error', (error) => {
    console.error(`Error de conexión a MongoDB: ${error}`);
    process.exit(1);
});

Mongoose.connection.once('open', () => {
    console.log(`Conectado a MongoDB en la BBDD => ${Mongoose.connection.name}`);
});

Mongoose.connect('mongodb://localhost/practicanode');
module.exports = Mongoose.connection;;