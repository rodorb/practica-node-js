'use strict';

const jwt = require('jsonwebtoken');


//módulo que exporta un middleware
module.exports = (request, response, next) => {
    //recoger el JWT de los headers, o de la queryString, o del body
    const jwtToken =
        request.get('Authorization') ||
        request.cookies.Authorization ||
        request.query.token ||
        request.body.token;

    //comprobar que me han dado un token
    if (!jwtToken) {
        const error = new Error('No token provided');
        error.status = 401;
        next(error);
        return;
    }
    //comprobar que el token es válido
    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            const error = new Error('Invalid token');
            error.status = 401;
            next(error);
            return;
        }
        //meto en la request una propiedad con el id del usuario recuperdao dl token
        //asi el siguiente mdw puede acceder a este id desde la request
        request.apiUserId = payload._id;
        //si el token es válido, continuar
        next();
    });

}