const Product = require('../model/ProductsModel')

const list = async (req,res,next)=>{
    let datos = req.user
    const {alias} = datos
    console.log(alias)
    const products = await Product.find({}).lean()
    res.render("listaContainer", {products, alias})
}
module.exports ={
    list
}