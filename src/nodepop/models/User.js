'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//creo el esquema
const userSchema = mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    role: String
});

//metodo estático
userSchema.statics.hashPassword = function(clearPassword) {
    return bcrypt.hash(clearPassword, 7);
};
//método de instancia
userSchema.methods.comparePassword = function(clearPassword) {
    return bcrypt.compare(clearPassword, this.password);
};

//creo el modelo
const User = mongoose.model('Usuario', userSchema);

//export el modelo
module.exports = User;