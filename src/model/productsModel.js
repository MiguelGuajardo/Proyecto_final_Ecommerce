const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema({
    date:{ type: String, required: true},
    title:{type: String, required:true},
    description:{type: String, required:true},
    code:{type: Number, required:true, unique: true},
    thumbnail:{type: String, required:true},
    price:{type: Number, required:true},
    stock:{type: Number, required:true}
})

const ProductModel = mongoose.model('products', ProductsSchema)

module.exports = ProductModel