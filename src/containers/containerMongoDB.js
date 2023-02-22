const mongoose = require('mongoose');
const productModel = require('../model/ProductsModel')
const cartModel = require('../model/cartModel')
const {config} = require("../config/index")
const logger = require("../utils/scriptLogger")

mongoose.set("strictQuery", false);

class ContainerMongoDB {
    constructor(connection){
        this.connection = connection
    }
    async startConnection() {
        await mongoose.connect(config.DATABASE.mongo.mongoUrl,{
        serverSelectionTimeoutMS: 5000,
        })
        logger.info("Base de datos conectada")
    }
    async getAll(collection) {
        try {
            if (collection == 'products') {
                let allProducts = await productModel.find({})
                return allProducts
            } else {
                let allCarts = await cartModel.find({})
                return allCarts
            }
        } catch (error) {
            logger.error(`No se obtuvieron los productos ${error}`)
        }
    }

    async getByID(collection,id){
        let objId = mongoose.Types.ObjectId(id)
        try {
            if (collection == 'products') {
                let product = await productModel.findById({_id:objId})
                return product
            } else {
                let cart = await cartModel.findById({_id:objId},{products:1})
                return cart
            }
        } catch (error) {
            logger.error(`No se pudo obtener el producto ${error}`)
        }
        
    }
    async save(collection,product){
        try {
            if (collection == 'products') {
                let newProduct = new productModel(product)
                let saveProduct = await newProduct.save()
                return saveProduct
            } else {
                let newCart = new cartModel(product)
                let saveCart = await newCart.save()
                return saveCart
            }
        } catch (error) {
            logger.error(`Error al guardar el producto ${error}`)
        }
        
    }
    async update(collection,id,product){
        let objId = mongoose.Types.ObjectId(id)
        try {
            if (collection == 'products') {
                let newProduct = await productModel.updateOne({
                    '_id':objId
                },{$set:{
                    date:product.date,
                    name:product.name,
                    description:product.description,
                    code:product.code,
                    thumbnail:product.thumbnail,
                    price:product.price,
                    stock:product.stock
                }})
                return newProduct
            } else {
                let newCart = await cartModel.updateOne({
                    _id:objId
                },{$push:{
                    'products':product
                }})
                return newCart
            }
        } catch (error) {
            logger.error(`Error al actualizar producto${error}`)
        }
    }
    async deleteByID(collection,id){
        let objId = mongoose.Types.ObjectId(id)
        try {
            if (collection == 'products') {
                let prod = await productModel.deleteOne({_id:objId})
                return prod
            } else {
                let cart = await cartModel.deleteOne({_id:objId})
                return cart
            }
        } catch (error) {
            logger.error(`Error al eliminar producto${error}`)
        }
    }
    async deleteProdCart(cartId,prodId, cart) {
        let objId = mongoose.Types.ObjectId(cartId)
        try {
            let prod = cart.products.find((prod) => prod._id.toString() === prodId)
            if (prod) {
                let newCart = await cartModel.updateOne({_id:objId}, {$pull:{products:prod}})
                return newCart
            } else {
                logger.warn('No se encontró el producto para eliminarlo')
            }
        } catch (error) {
            logger.error(`Error al eliminar el producto del carrito ${error}`)
        }
    }

    async getConnection () {
        await this.startConnection()
    }
}

module.exports = ContainerMongoDB;

