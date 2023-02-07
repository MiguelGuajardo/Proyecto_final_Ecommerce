const express = require("express")
const CartDaoFileSystem = require("../daos/cart/cartDaoFileSystem")

class CartController{
    constructor(){
        this.router = express.Router()
        this.cartDaoFileSystem = new CartDaoFileSystem()

        this.router.get("/",(req,res)=>{
            this.cartDaoFileSystem.getAll()
            .then((products) => res.json(products))
            .catch((err) => res.send({error: `hubo un error al traer los productos ${err}`}))
        })
        this.router.get("/:id",(req,res)=>{
            let id = parseInt(req.params.id);
            this.cartDaoFileSystem.getByID(id)
            .then((product) => res.json(product))
            .catch((err) => res.send({error : `Producto no encontrado ${err}`}))
        })
        this.router.post("/",(req,res)=>{
            const product = req.body;
            this.cartDaoFileSystem.save(product)
            .then(() => this.cartDaoFileSystem.getAll())
            .then((carts) => res.json(carts))
            .catch((err) => res.send({error : `No se pudo guardar el producto ${err}`}))
        })
        this.router.post('/:id/productos', async (req, res) => {
            let count= function(){
                return Math.floor(Math.random()* 1000)
            }
            let product = req.body;
            let newProduct = {id:count(),date: new Date().toLocaleString(),...product}
            let id = parseInt(req.params.id);
            this.cartDaoFileSystem.getByID(id)
            .then((cart) => {
              cart.products.push(newProduct)
              this.cartDaoFileSystem.update(cart.id, cart)
              return res.json(cart)
            })
            .catch((err) => res.send({error: `no se pudo agregar el producto ${err}`}))
          })
        this.router.delete("/:id",(req,res)=>{
            let id = parseInt(req.params.id)
            this.cartDaoFileSystem.deleteByID(id)
            .then(() => res.send('carrito eliminado'))
      .catch((err) => res.send({error: `error al eliminar el carrito ${err}`}))
        })
        this.router.delete("/:id/productos/:id_prod",(req,res)=>{
            let cartId = parseInt(req.params.id)
      let prodId = parseInt(req.params.id_prod)
            this.cartDaoFileSystem.getByID(cartId)
            .then((cart)=>{
                cart.products = cart.products.filter((prod)=>
                    prod.id !== prodId
                )
                this.cartDaoFileSystem.update(cartId,cart)
                return res.send('producto eliminado del carrito')
            })
            .catch((err) => res.send({error: `error al eliminar producto del carrito ${err}`}))
        })
    }
    getRouter = () => {
        return this.router
      }
}
module.exports = CartController