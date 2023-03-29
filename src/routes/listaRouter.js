const express = require("express")
const router = express.Router()

const lista = require('../controller/listaController.js')

router.get("/",isAuthenticated , lista.getProducts)

router.post("/", isAuthenticated,lista.checkOut)

function isAuthenticated (req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}
module.exports = router