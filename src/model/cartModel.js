const mongoose = require('mongoose');
const productsSchema = require('./ProductsModel')

const cartSchema = new mongoose.Schema({
    date:{ type: String, required: true},
    products:[]
})

const cartModel = mongoose.model('carritos', cartSchema)

module.exports = cartModel;