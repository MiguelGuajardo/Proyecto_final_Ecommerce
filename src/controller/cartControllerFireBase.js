const express = require("express")
const CartDaoFireBase = require("../daos/cart/cartDaoFireBase")

class CartController{
    constructor(){

        this.router = express.Router()
        this.cartDaoFireBase = new CartDaoFireBase()

        this.router.get('/', (req, res) =>{
            this.cartDaoFireBase.getAll()
            .then((result) => res.json(result))
            .catch(error => res.json(error))
        })

        this.router.get('/:id', (req, res) =>{
            this.cartDaoFireBase.getById(req.params.id)
            .then((result) => res.json(result.productos))
            .catch(error => res.json(error))
        })

        this.router.post('/', (req, res) =>{
            const carrito = req.body
            carrito.timestamp = Date.now()
            this.cartDaoFireBase.add(carrito)
            .then((result) => res.json(result))
            .catch(error => res.json(error))
        })

        // Agregar productos al carro
        this.router.post('/:id/productos', (req, res) =>{
            this.cartDaoFireBase.addProduct(req.params.id, req.body)
            .then((result) => res.json(result))
            .catch(error => res.json(error))
        })

        this.router.put('/:id', (req, res) =>{
            this.cartDaoFireBase.update(req.params.id, req.body)
            .then((result) => res.json(result))
            .catch(error => res.json(error))
        })
        
        this.router.delete('/:id', (req, res) =>{
            this.cartDaoFireBase.delete(req.params.id)
            .then((result) => res.json(result))
            .catch(error => res.json(error))
        })
        
        this.router.delete('/:id/productos/:id_prod', (req, res) =>{
            this.cartDaoFireBase.deleteProduct(req.params.id, req.params.id_prod)
            .then((result) => res.json(result))
            .catch(error => res.json(error))
        })

    }

    getRouter(){
        return this.router
    }

}

module.exports = CartController