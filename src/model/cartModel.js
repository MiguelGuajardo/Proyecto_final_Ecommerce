const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    email: {type: String},
    products: {type: Array}
    }
)

const cartModel = mongoose.model('carritos', cartSchema)

module.exports = cartModel;