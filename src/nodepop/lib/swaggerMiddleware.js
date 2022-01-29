'use strict';
const SWAGGER_JS_DOC = require('swagger-jsdoc');
const SWAGGER_UI = require('swagger-ui-express');
const OPTIONS = {
    swaggerDefinition: {
        info: {
            title: 'NodeApp API',
            version: '0.1',
            description: 'API de Agentes'
        }
    },
    apis: ['swagger.yaml']
};


const SPECIFICATION = SWAGGER_JS_DOC(OPTIONS);
module.exports = [SWAGGER_UI.serve, SWAGGER_UI.setup(SPECIFICATION)];