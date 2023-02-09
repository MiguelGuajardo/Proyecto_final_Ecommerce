const express = require("express")
const router = express.Router()

const lista = require("../controller/listaControllers")

router.get("/",isAuthenticated , lista.list)

function isAuthenticated (req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

module.exports = router