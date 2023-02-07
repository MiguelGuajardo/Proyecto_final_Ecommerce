const passport = require("passport")
const Product = require("../model/productsModel")
const sharp = require("sharp")
const fs = require("fs")
const INFO = require("../utils/info")
const { fork } = require("child_process")

const login = (req,res,next)=>{
    res.render("login")
}
const loginPassport = passport.authenticate("local-login" ,{
    successRedirect:"/",
    failureRedirect:"/login-error",
    passReqToCallback:true
})
const login_error = (req,res,next)=>{
    logger.info("Login error"),
    res.render('login-error')
}
const register_error = (req,res,next)=>{
    logger.info("Register error"),
    res.render("register-error")
}
const register = (req,res,next)=>{
    res.render("register")
}
const registerPassport = passport.authenticate("local-register",{
    successRedirect:"/",
    failureRedirect:"/register-error",
    passReqToCallback:true
})
const logOut = (req, res, next) => {
    logger.info("LogOut success"),
    res.redirect('/login');
    req.session.destroy()
  }
const authenticateHome = async(req,res,next)=>{
    let datos = req.user
    let datosProducts = await Product.find({}).lean()
    const {alias} = datos

    res.render("index",{alias,datosProducts})
}
const productPost = async(req,res,next)=>{
    const {title,price,thumbnail} =req.body
    const newProduct = new Product()
    newProduct.title = title
    newProduct.price = price
    newProduct.thumbnail = thumbnail
    await newProduct.save()
    logger.info("Product added successfully"),
    res.redirect("/")
}
const profile = (req,res)=>{
    let datos = req.user
    const {email,firstName,lastName,alias,edad,direccion,creationDate,phone,_id} = datos
    const avatarImageId = `uploads/${_id}.png`
    const sesionId = req.session.id
    res.render("profile",{sesionId, email,alias,edad,direccion,creationDate,phone,firstName,lastName,avatarImageId,_id})
}
const profileThumbnail = async (req,res,next)=>{
    let datos = req.user
    const {email,firstName,lastName,alias,edad,direccion,creationDate,phone,_id} = datos

    const avatar = req.file

    const proccesedAvatar = sharp(avatar.buffer)
    const resizeAvatar = proccesedAvatar
    const resizeAvatarBuffer = await resizeAvatar.toBuffer()
    fs.writeFileSync(`public/uploads/${_id}.png`,resizeAvatarBuffer)
    logger.info("Profile picture added successfully")
    const avatarImageId = `uploads/${_id}.png`

    res.render("profile",{email,firstName,lastName,alias,edad,direccion,creationDate,phone,avatarImageId})
    
}

module.exports = {
    login,
    login_error,
    loginPassport,
    register,
    register_error,
    registerPassport,
    logOut,
    authenticateHome,
    productPost,
    profile,
    profileThumbnail,
}