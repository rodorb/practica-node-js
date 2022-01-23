'use strict';
const Mongoose = require('mongoose');

const advertisementSchema = Mongoose.Schema({
    name: { type: String, index: true },
    forSale: { type: Boolean, index: true },
    price: { type: Number, index: true },
    priceUnit: { type: String },
    photo: { type: String },
    tags: { type: [String], index: true }
});

advertisementSchema.statics.listar = function(filters, skip, limit, sortBy) {
    const query = Advertisement.find(filters);
    query.skip(skip);
    query.limit(limit);
    query.sort(sortBy);
    return query.exec();
}
const Advertisement = Mongoose.model('Advertisement', advertisementSchema);


module.exports = Advertisement;