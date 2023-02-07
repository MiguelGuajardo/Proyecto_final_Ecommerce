const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    date:{ type: String, required: true},
    name:{type: String, required:true},
    description:{type: String, required:true},
    code:{type: Number, required:true, unique: true},
    thumbnail:{type: String, required:true},
    price:{type: Number, required:true},
    stock:{type: Number, required:true}
})

const productModel = mongoose.model('products', productsSchema)
module.exports = {
    productModel,
    productsSchema
};