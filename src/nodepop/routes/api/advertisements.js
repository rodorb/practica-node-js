'use strict';

const Express = require('express');
const CreateError = require('http-errors');
const Advertisement = require('../../models/Advertisement.js');
const Router = Express.Router();
const { query, body, param, validationResult } = require('express-validator');
const Multer = require('multer');
const MulterStorage = Multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/anuncios");
    },
    filename: (req, file, cb) => {
        //   const ext = file.mimetype.split("/")[1];
        cb(null, `${file.originalname}`);
    },
});
const Upload = Multer({ storage: MulterStorage })
const POSSIBLE_TAGS = ['work', 'lifestyle', 'motor', 'mobile'];

Router.get('/', async(request, response, next) => {
    try {
        const queryParams = request.query;
        // const schemaKeys = Object.keys(Advertisement.schema.paths);
        const filters = {};
        const limit = queryParams.limit;
        const skip = queryParams.start;
        const sortBy = queryParams.sort;

        if (queryParams.tag) {
            filters['tags'] = queryParams.tag;
        }
        if (queryParams.forSale) {
            filters.forSale = queryParams.forSale;
        }
        if (queryParams.name) {
            filters.name = new RegExp(`^${queryParams.name}`, "i");
        }
        setPriceFilter(queryParams, filters);
        const addvertisements = await Advertisement.listar(filters, skip, limit, sortBy);
        response.locals.title = response.__('Advertisements list')
        response.locals.addvertisements = addvertisements.map((ad) => { return {...ad._doc, thumbnail: ad.photo.split('.')[0] + '-thumbnail' + ad.photo.substring(ad.photo.indexOf('.')) } });
        response.render('advertisements');
        // response.json({ anuncios: addvertisements });
    } catch (error) {
        next(error);
    }
}); //DONE: (probar la pagicación)
// Operaciones que debe realizar el API a crear:
// - Lista de anuncios con posibilidad de paginación. Con filtros por tag, tipo de anuncio (venta o búsqueda), 
// rango de precio (precio min. y precio max.) y nombre de artículo (que empiece por el dato buscado)
//http://localhost:3000/api/anuncios?tag=mobile&forSale=false&name=ip&price=50-&start=0&limit=2&sort=price




Router.get('/tags', (request, response, next) => {
    response.locals.title = 'Tags admitidos'
    response.locals.tags = POSSIBLE_TAGS;
    response.render('tags');
}); // DONE: - Lista de tags existentes


//TODO: COmo usar el MDW de multer para coger del body el archivo de la imagen???
Router.post('/createAd', [
        Upload.single('photo'),
        body().custom(function(wholeBody) { return isValidBody(wholeBody) }).withMessage(`You need to include all obligatory properties with their corresponding correct types!`)

    ],
    async(request, response, next) => {
        try {
            validationResult(request).throw(); //verifica las validaciones de esta petición
            const AD_DATA = request.body;
            const validTags = filterValidTags(AD_DATA.tags);
            if (validTags && validTags.length > 0) {
                const AD_DATA_CLONE = {...AD_DATA };
                AD_DATA_CLONE.tags = validTags;
                parseBody(AD_DATA_CLONE, request.file)
                const AD = new Advertisement(AD_DATA_CLONE);
                const SAVED_AD = await AD.save();
                AD.resizeImage(request.file.filename, request.file.destination);
                response.status(201).json(SAVED_AD);
            } else {
                next(CreateError(422, `You must insert at least one valid tag to create a product advertisement, all possible tags are : ${JSON.stringify(POSSIBLE_TAGS)}. You can also see check valid tags in ${request.protocol}://${request.get('host')}/api/anuncios/tags`));
            }
        } catch (error) {
            next(error);
        }
    }); // DONE: - Creación de anuncio -->(hacer validacion para que solo deje insertar) 
//TODO: Si me da tiempo hacer el upload de  la imagen

function setPriceFilter(queryParams, filters) {
    const rangePriceRegex = /^\d+-\d+$/;
    const greaterThanPriceRegex = /^\d+-$/;
    const lessThanPriceRegex = /^-\d+$/;
    const onlyPriceNumberRegex = /^\d+$/;
    if (queryParams.price) {
        const price = queryParams.price;
        if (rangePriceRegex.test(price)) {
            const gteValue = price.split('-')[0];
            const lteValue = price.split('-')[1];
            filters.price = { '$gte': gteValue, '$lte': lteValue };
        } else if (greaterThanPriceRegex.test(price)) {
            filters.price = { '$gte': price.replace('-', '') };
        } else if (lessThanPriceRegex.test(price)) {
            filters.price = { '$lte': price.replace('-', '') };
        } else if (onlyPriceNumberRegex.test(price)) {
            filters.price = price;
        }
    }
}

function filterValidTags(tags) {
    const TAGS_CLONE = [...tags];
    const VALID_TAGS = TAGS_CLONE.filter((e) => { return POSSIBLE_TAGS.indexOf(e) > -1 });
    return VALID_TAGS;
}

function parseBody(body, file) {

    const AdvertisementModelKeys = {...Advertisement.schema.paths };
    for (const key in AdvertisementModelKeys) {
        if (key !== '_id' && key !== '__v' && key !== 'photo') {
            if (body.hasOwnProperty(key)) {
                const checkArray = AdvertisementModelKeys[key].instance === 'Array';
                const checkString = AdvertisementModelKeys[key].instance === 'String';
                body[key] = checkString || checkArray ? body[key] : JSON.parse(body[key]);
            }
        } else if (key === 'photo') {
            body[key] = file.filename;
        }
    }
}


function isValidBody(body) {
    const bodyClone = {...body };

    let valid = true;
    const AdvertisementModelKeys = {...Advertisement.schema.paths };
    for (const key in AdvertisementModelKeys) {
        if (key !== '_id' && key !== '__v' && key !== 'photo') {
            if (bodyClone.hasOwnProperty(key)) {
                const checkArray = AdvertisementModelKeys[key].instance === 'Array';
                const checkString = AdvertisementModelKeys[key].instance === 'String';
                bodyClone[key] = checkString || checkArray ? bodyClone[key] : JSON.parse(bodyClone[key]);
                const isValidArrayProperty = checkArray && Array.isArray(bodyClone[key]);
                const isValidNonArrayProperty = !checkArray && typeof bodyClone[key] === AdvertisementModelKeys[key].instance.toLowerCase();
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

// TODO: Si me da tiempo hacer que se puedan acceder facilmente a los filtros con botones... (si no, en el .README hay ejemplos)



module.exports = Router;