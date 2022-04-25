require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const loginController = require('./controllers/loginController.js');
const jwtAuthMdw = require('./lib/jwtAuthMiddleware.js');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const addvertisementsRouter = require('./routes/api/advertisements.js');
const docAPI = require('./lib/swaggerMiddleware');
const { isAPIRequest } = require('./lib/utils');

var app = express();

require('./lib/connectMongoose');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/login', loginController.index);
app.post('/login', loginController.postJWT);
app.get('/logout', loginController.logout);
app.post('/api/authenticate', loginController.postJWT);
//rutas
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/anuncios', jwtAuthMdw, addvertisementsRouter);
app.use('/api/docs', docAPI);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    //gestionando error de validación
    if (err.array) {
        //error de validación
        err.status = 422;
        const errInfo = err.array({ onlyFirstError: true })[0];
        console.log(errInfo);
        err.message = `(${errInfo.location}) ${errInfo.param} - ${errInfo.msg}`;
    }
    res.status(err.status || 500);
    //si es un error en el API respondo con un JSON
    if (isAPIRequest(req)) {
        res.json({ error: err.message });
        return;
    }
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page

    res.render('error');
});

module.exports = app;