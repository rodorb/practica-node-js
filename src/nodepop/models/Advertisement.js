'use strict';
const Mongoose = require('mongoose');
const { Requester } = require('cote');
const requester = new Requester({ name: 'nodepop' });


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

advertisementSchema.methods.resizeImage = async function(image, destination) {
    const event = {
        type: 'create-thumbnail',
        image,
        destination
    };
    return new Promise((resolve, reject) => requester.send(event, (err, result) => {
        if (err) {
            const error = new Error(err.message);
            error.status = 500;
            reject(error);
            return;
        }
        resolve(result);
    }));

}
const Advertisement = Mongoose.model('Advertisement', advertisementSchema);


module.exports = Advertisement;