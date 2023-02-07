const { Router } = require('express');
const ContainerMongoDB = require('../../containers/containerMongoDB');


class ProductsDaoMongo extends ContainerMongoDB{
    constructor(){
        super(`mongodb://localhost/proyectEcommerce`)
        this.router = Router()
        this.prodConnection = super.startConnection()

        this.router.get('/', async (req, res) => {
            try {
                let products = await super.getAll('products')
                return res.json(products)
            } catch (error) {
                return res.send({error: `hubo un error al traer los productos ${err}`})
            }
        });

        this.router.get('/:id', async (req, res) => {
            try {
                let id = req.params.id;
                let product = await super.getByID('products',id)
                return res.json(product)
            } catch (error) {
                return res.send({error : `Producto no encontrado ${err}`})
            }
        });

        this.router.post('/', async (req, res) => {
            try {
                const product = {
                    date: new Date().toLocaleString(),
                    name: req.body.name,
                    description:req.body.description,
                    code:req.body.code,
                    thumbnail:req.body.thumbnail,
                    price:req.body.price,
                    stock:req.body.stock
                };
                await super.save('products',product)
                let products = await super.getAll('products');
                return res.json("Producto agregado satisfactoriamente")
            } catch (error) {
                return res.send({error : `No se pudo guardar el producto ${err}`})
            }
        });

        this.router.put('/:id', async (req, res) => {
            try {
                let id = req.params.id
                let product = {
                    _id:req.body._id,
                    date: new Date().toLocaleString(),
                    name: req.body.name,
                    description:req.body.description,
                    code:req.body.code,
                    thumbnail:req.body.thumbnail,
                    price:req.body.price,
                    stock:req.body.stock
                };
                await super.update('products',id,product)
                return res.send('producto actualizado')
            } catch (error) {
                return res.send({error: `error al actualizar producto ${err}`})
            }
        });

        this.router.delete("/:id", async (req, res) => {
            try {
                let id = req.params.id;
                await super.deleteByID('products',id)
                return res.send("Producto eliminado satisfactoriamente")
            } catch (error) {
                return res.send({error: `error al eliminar producto ${err}`})
            }
            
        });
    }

    getRouter = () => {
        return this.router
    }
    
}

module.exports = ProductsDaoMongo;