const express = require("express")
const router = express.Router()
const multer  = require('multer')
const configMemoryStorage = multer.memoryStorage()
const upload = multer({ storage: configMemoryStorage})

const auth = require("../controller/authControllers")

router.get("/login",auth.login)

router.post("/login",auth.loginPassport)

router.get("/login-error",auth.login_error)

router.get("/register",auth.register)

router.get("/register-error", auth.register_error)

router.post("/register", auth.registerPassport)

router.get('/logout', auth.logOut)

router.get("/",isAuthenticated, auth.authenticateHome )

router.post("/", auth.productPost)

router.get("/profile", isAuthenticated , auth.profile)

router.post("/profile", upload.single('avatar'), auth.profileThumbnail)


function isAuthenticated (req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}


module.exports = router