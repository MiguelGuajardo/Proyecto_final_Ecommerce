const Product = require('../model/productsModel.js')
const Logger = require('../utils/logger.js')
const logger =  new Logger()

class ProductsDaoMongo {
    constructor(){
    }
    #readProducts = async() => {
        const data = await Product.find().lean()
        return data
    }

    getAll = async() => {
        try {
            return await this.#readProducts()
        } catch (error) {
            logger.error(error)
        }
    }

    save = async(product) => {
        try {
            let products = await this.#readProducts()
            products.save(product)
            return product
        } catch (error) {
            logger.error(error)
        }
    }
}
module.exports = ProductsDaoMongo