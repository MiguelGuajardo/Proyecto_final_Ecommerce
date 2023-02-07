const mongoose = require('mongoose');
const {productsSchema} = require('./productsModel')

const cartSchema = new mongoose.Schema({
    date:{ type: String, required: true},
    products:[productsSchema]
})

const cartModel = mongoose.model('carritos', cartSchema)
module.exports = cartModel;