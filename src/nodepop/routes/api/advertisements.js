'use strict';

const Express = require('express');
const CreateError = require('http-errors');
const Advertisement = require('../../models/Advertisement.js');
const Router = Express.Router();
const POSSIBLE_TAGS = [' work', 'lifestyle', 'motor', 'mobile'];
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
        const addvertisements = await Advertisement.listar(filters, skip, limit, sortBy);
        response.locals.title = 'Lista de anuncios'
        response.locals.addvertisements = addvertisements;
        response.render('advertisements');
        // response.json({ anuncios: addvertisements });
    } catch (error) {
        next(error);
    }
});



// DONE: - Lista de tags existentes????
Router.get('/tags', (request, response, next) => {
    response.locals.title = 'Tags admitidos'
    response.locals.tags = POSSIBLE_TAGS;
    response.render('tags');
});

// DONE: - Creación de anuncio -->(hacer validacion para que solo deje insertar) TODO: ¿Como insertar la imagen?
Router.post('/createAd', async(request, response, next) => {
    try {
        const AD_DATA = request.body;
        if (isValidBody(AD_DATA)) {
            if (AD_DATA.tags && AD_DATA.tags.length > 0) {
                const AD_DATA_CLONE = {...AD_DATA };
                let validTags = AD_DATA.tags.filter((e) => { return POSSIBLE_TAGS.indexOf(e) > -1 });
                if (validTags && validTags.length > 0) {
                    AD_DATA_CLONE.tags = validTags;
                    const AD = new Advertisement(AD_DATA_CLONE);
                    const SAVED_AD = await AD.save();
                    response.status(201).json(SAVED_AD);
                } else {
                    next(CreateError(400, `You must insert at least one valid tag to create a product advertisement`));
                }
            } else {
                next(CreateError(400, `You must insert at least one valid tag to create a product advertisement`));
            }
        } else {
            next(CreateError(400, `You need to include all obligatory properties with their corresponding correct types`));
        }


    } catch (error) {
        next(error);
    }
});

function isValidBody(body) {
    let valid = true;
    const AdvertisementModelKeys = {...Advertisement.schema.paths };
    for (const key in AdvertisementModelKeys) {
        if (key !== '_id' && key !== '__v') {
            if (body.hasOwnProperty(key)) {
                const checkArray = AdvertisementModelKeys[key].instance === 'Array';
                const isValidArrayProperty = checkArray && Array.isArray(body[key]);
                const isValidNonArrayProperty = !checkArray && typeof body[key] === AdvertisementModelKeys[key].instance.toLowerCase();
                if (!isValidArrayProperty && !isValidNonArrayProperty) {
                    valid = false;
                    break;
                }
            } else {
                valid = false;
                break;
            }
        }

    }
    return valid;
}

// DONE: - El API tendrá que devolver las imágenes, por ejemplo de la carpeta /public/images/<nombreRecurso>, 
// por tanto obtendriamos una imagen haciendo una petición en la url http://localhost:3000/images/anuncios/iphone.jpg (esto lo hace pero solo con las imagenes precargadas)

// TODO: Si me da tiempo hacer que las imagenes se muestren en el frontal y que se puedan acceder facilmente a los filtros con botones...



module.exports = Router;