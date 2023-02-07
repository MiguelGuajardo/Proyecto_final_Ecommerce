const { Router } = require('express');
const ContainerMongoDB = require('../../containers/containerMongoDB');

class CartDaoMongo extends ContainerMongoDB{
    constructor(){
        super(`mongodb://localhost/proyectEcommerce`)
        this.router = Router()

        this.router.get('/', async (req, res) => {
            try {
                let allCarts = await super.getAll('carts')
                return res.json(allCarts)
            } catch (error) {
                return res.send({error: `hubo un error al traer los carritos ${err}`})
            }
        });

        this.router.get('/:id/productos', async (req, res) => {
            let id = req.params.id;
            try {
                let cart = await super.getByID('carts',id)
                return res.json(cart)
            } catch (error) {
                return res.send({error : `Carrito no encontrado ${err}`})
            }
        
        });

        this.router.post('/', async (req, res) => {
            let cart = {
                date: new Date().toLocaleString(),
                products: {
                    _id: req.body._id,
                    date: new Date().toLocaleString(),
                    name: req.body.name,
                    description:req.body.description,
                    code:req.body.code,
                    thumbnail:req.body.thumbnail,
                    price:req.body.price,
                    stock:req.body.stock
                }
            }
            try {
                await super.save('carts',cart)
                let carts = await super.getAll('carts')
                return res.json(carts)
            } catch (error) {
                return res.send({error : `No se pudo guardar el producto ${err}`})
            }
        });

        this.router.post('/:id/productos', async (req, res) => {
            let product = {
                _id: req.body._id,
                date: new Date().toLocaleString(),
                name: req.body.name,
                description:req.body.description,
                code:req.body.code,
                thumbnail:req.body.thumbnail,
                price:req.body.price,
                stock:req.body.stock
            }
            let id = req.params.id;
            try {
                let cart = await super.getByID('carts',id)
                cart.products.push(product)
                let newCart = await super.update('carts',cart._id,product)
                return res.json(newCart)
            } catch (error) {
                return res.send({error: `no se pudo agregar el producto ${err}`})
            }
            
        })

        this.router.delete("/:id", async (req, res) => {
            let id = req.params.id;
            try {
                await super.deleteByID('carts',id)
                return res.send('carrito eliminado')
            } catch (error) {
                return res.send({error: `error al eliminar el carrito ${err}`})
            }
        });

        this.router.delete('/:id/productos/:id_prod', async (req, res) => {
            let cartId = req.params.id;
            let prodId = req.params.id_prod
            try {
                let cart = await super.getByID('carts',cartId)
                await super.deleteProdCart(cartId,prodId,cart)
                return res.send('producto eliminado del carrito')
            } catch (error) {
                return res.send({error: `error al eliminar producto del carrito ${err}`})
            }
        })
    }

    getRouter = () => {
        return this.router
    }
}


module.exports = CartDaoMongo;