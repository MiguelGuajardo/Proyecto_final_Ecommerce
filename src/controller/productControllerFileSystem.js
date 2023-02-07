const express = require("express")
const ProductsDaoFileSystem = require("../daos/products/prodDaoFileSystem")

class ProductController{
    constructor(){
        this.router = express.Router()
        this.productDaoFileSystem = new ProductsDaoFileSystem()

        this.router.get("/",(req,res)=>{
            this.productDaoFileSystem.getAll()
            /* .then((products) => res.json(products)) */
            .then((productos)=> res.render("listProduct", {productos}))
            .catch((err) => res.send({error: `hubo un error al traer los productos ${err}`}))
        })
        this.router.get("/:id",(req,res)=>{
            let id = parseInt(req.params.id);
            this.productDaoFileSystem.getByID(id)
            .then((product) => res.json(product))
            .catch((err) => res.send({error : `Producto no encontrado ${err}`}))
        })
        this.router.post("/",(req,res)=>{
            const product = req.body;
            this.productDaoFileSystem.save(product)
            .then(() => this.productDaoFileSystem.getAll())
            .then((prods) => res.json(prods))
            .catch((err) => res.send({error : `No se pudo guardar el producto ${err}`}))
        })
        this.router.put("/:id",(req,res)=>{
            let id = parseInt(req.params.id)
            let product = req.body
            this.productDaoFileSystem.update(id,product)
            .then((result) => res.json(result))
            .catch((err) => res.send({error: `error al actualizar producto ${err}`}))
        })
        this.router.delete("/:id",(req,res)=>{
            let id = parseInt(req.params.id)
            this.productDaoFileSystem.deleteByID(id)
            .then((result) => res.json(result))
            .catch((err) => res.send({error: `error al eliminar producto ${err}`}))
        })
    }
    getRouter = () => {
        return this.router
    }
}
module.exports = ProductController