'use strict';
const Mongoose = require('mongoose');

const advertisementSchema = Mongoose.Schema({
    name: { type: String },
    forSale: { type: Boolean },
    price: { type: Number },
    priceUnit: { type: String },
    photo: { type: String },
    tags: [String]
});

advertisementSchema.statics.listar = function(filters, skip, limit, select, sortBy) {
    const query = Advertisement.find(filters);
    query.skip(skip);
    query.limit(limit);
    query.select(select);
    query.sort(sortBy);
    return query.exec();
}
const Advertisement = Mongoose.model('Advertisement', advertisementSchema);


module.exports = Advertisement;