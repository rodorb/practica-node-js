'use strict';
import fsPromise from 'fs/promises';
import readline from 'readline';
import MongooseConnection from './lib/connectMongoose.js'; //cargo la conexión a la BBDD
import Advertisement from './models/Advertisement.js'; //cargo el modelo

MongooseConnection.once('open', () => {
    main().catch((err) => {
        console.error(`Se ha producido un error => ${err}`);
    })
});

async function main() {
    //inicializar los datos borrando primero los anuncios que hubiera en la BBDD
    await initAdvertisements();
    //cerrar la conexión con la BBDD tras la inicialización
    MongooseConnection.close();
}


async function initAdvertisements() {
    const deleted = await Advertisement.deleteMany();
    console.log(`Eliminados ${deleted.deletedCount} anuncios.`);

    const data = await fsPromise.readFile('initDB.advertisements.json', 'utf-8');
    const advertisementData = JSON.parse(data);
    const insertedAdvertisements = await Advertisement.insertMany(advertisementData.anuncios);

    console.log(`Insertados ${insertedAdvertisements.length} anuncios.`);
}