'use strict';

const User = require("../models/User");
const jwt = require('jsonwebtoken');

class LoginController {
    constructor() {}
    index(request, response, next) {
        response.locals.email = '';
        response.locals.error = '';
        response.render('login');

    }

    // login post from API that returns Json Web Token
    async postJWT(request, response, next) {
        try {
            const { email, password } = request.body;
            //buscar el usuario en BBDD
            const user = await User.findOne({ email });
            //si no lo encuentro o no coincide la contraseña (comparandolo con bCrypt)--> error
            if (!user || !(await user.comparePassword(password))) {
                response.json({ error: 'Invalid credentials' });
                return;
            }
            //generamos un JWT con su _id
            //payload                   , secret            , objeto opciones
            jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
                expiresIn: "2d"
            }, (error, jwtToken) => {
                if (error) {
                    next(error);
                    return;
                }
                //devuelve el JWT
                // response.json({ token: jwtToken });
                //si lo encuentro y la contraseña coincide --> redirigir a la zona privada
                response.cookie('Authorization', jwtToken, {
                    maxAge: 1000 * 60 * 60 * 24 //un dia
                }).status(302).redirect('/api/anuncios');
            });

        } catch (error) {
            next(error);
        }

    }

    logout(request, response, next) {
        response.clearCookie('Authorization').status(302).redirect('/login');

    }

}

module.exports = new LoginController();