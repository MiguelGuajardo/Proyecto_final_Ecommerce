const PersistenteceFactory = require('../daos/persistenceFactory.js')

class ProductService {
    constructor(){
        this.productsDao
        this.#init()
    }

    #init = async () => {
        this.productsDao = await PersistenteceFactory.getPersistenece()
    }

    getProducts = async() => {
        return await this.productsDao.getAll()
    }
    getProductByid = async(id) => {
        return await this.productsDao.getOne(id)
    }

    addProduct = async(product) => {
        return await this.productsDao.save(product)
    }
}
module.exports = ProductService