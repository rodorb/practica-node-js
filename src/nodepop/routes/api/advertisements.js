'use strict';

const Express = require('express');
const CreateError = require('http-errors');
const Advertisement = require('../../models/Advertisement.js');
const Router = Express.Router();
//DONE: (probar la pagicación)
// Operaciones que debe realizar el API a crear:
// - Lista de anuncios con posibilidad de paginación. Con filtros por tag, tipo de anuncio (venta o búsqueda), 
// rango de precio (precio min. y precio max.) y nombre de artículo (que empiece por el dato buscado)
//http://localhost:3000/api/anuncios?tag=mobile&forSale=false&name=ip&price=50-&start=0&limit=2&sort=price
Router.get('/', async(request, response, next) => {
    try {
        const queryParams = request.query;
        // const schemaKeys = Object.keys(Advertisement.schema.paths);
        const filters = {};
        const limit = queryParams.limit;
        const skip = queryParams.start;
        const select = queryParams.select;
        const sortBy = queryParams.sort;
        const rangePriceRegex = /^\d+-\d+$/;
        const greaterThanPriceRegex = /^\d+-$/;
        const lessThanPriceRegex = /^-\d+$/;
        const onlyPriceNumberRegex = /^\d+$/;
        if (queryParams.tag) {
            filters['tags'] = queryParams.tag;
        }
        if (queryParams.forSale) {
            filters.forSale = queryParams.forSale;
        }
        if (queryParams.name) {
            filters.name = new RegExp(`^${queryParams.name}`, "i");
        }
        if (queryParams.price) {
            const price = queryParams.price;
            if (rangePriceRegex.test(price)) {
                const gteValue = price.split('-')[0];
                const lteValue = price.split('-')[1];
                filters.price = { '$gte': gteValue, '$lte': lteValue }
            } else if (greaterThanPriceRegex.test(price)) {
                filters.price = { '$gte': price.replace('-', '') };
            } else if (lessThanPriceRegex.test(price)) {
                filters.price = { '$lte': price.replace('-', '') };
            } else if (onlyPriceNumberRegex.test(price)) {
                filters.price = price;
            }
        }
        const addvertisements = await Advertisement.listar(filters, skip, limit, select, sortBy);
        response.locals.title = 'Lista de anuncios'
        response.locals.addvertisements = addvertisements;
        response.render('advertisements');
        // response.json({ anuncios: addvertisements });
    } catch (error) {
        next(error);
    }
});



// TODO: - Lista de tags existentes????
// TODO: - Creación de anuncio --> ¿Como insertar la imagen?
// TODO: - El API tendrá que devolver las imágenes, por ejemplo de la carpeta /public/images/<nombreRecurso>, 
// por tanto obtendriamos una imagen haciendo una petición en la url http://localhost:3000/images/anuncios/iphone.png
// TODO: Si me da tiempo hacer que las imagenes se muestren en el frontal y que se puedan acceder facilmente a los filtros con botones...



module.exports = Router;