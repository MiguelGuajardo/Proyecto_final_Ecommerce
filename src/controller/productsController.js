const ProductService = require('../services/productsService.js')
const productService = new ProductService()

    const getProducts = async(req,res) => {
        let products = await productService.getProducts()
        res.send(products)
    }
    const getProductById = async(req,res)=>{
        let id = req.params.id
        let product = await productService.getProductByid(id)
        res.send(product)
    }

    const saveProduct = async(req,res) => {
        let product = req.body;
        let productAdded = await productService.addProduct(product)
        res.send(productAdded)
    }
module.exports = {
    getProducts,
    getProductById,
    saveProduct
}