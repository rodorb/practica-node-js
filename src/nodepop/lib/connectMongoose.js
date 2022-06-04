'use strict';
const Mongoose = require('mongoose');
const databaseUri = proces.env.DATABASE_URI || 'mongodb://localhost/practicanode'
Mongoose.connection.on('error', (error) => {
    console.error(`Error de conexión a MongoDB: ${error}`);
    process.exit(1);
});

Mongoose.connection.once('open', () => {
    console.log(`Conectado a MongoDB en la BBDD => ${Mongoose.connection.name}`);
});

Mongoose.connect(databaseUri);
module.exports = Mongoose.connection;