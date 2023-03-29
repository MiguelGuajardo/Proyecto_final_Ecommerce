const express = require('express')
const router = express.Router()

const productControllers = require('../controller/productsController.js')

router.get('/', productControllers.getProducts)

router.get('/:id', productControllers.getProductById)

router.post('/', productControllers.saveProduct)

module.exports = router