const Product = require('../model/ProductsModel')
const Cart = require("../model/cartModel")
const nodemailer = require("nodemailer")
const Logger = require("../utils/logger")
const logger = new Logger()

const list = async (req,res,next)=>{
    let datos = req.user
    const {alias} = datos
    const products = await Product.find({}).lean()
    res.render("listaContainer", {products, alias})
}
const checkOut = async (req,res,next)=>{
    const products = await Product.find({}).lean()
    const prodArr = []
    const productsCart = req.body.product
    for (const property in productsCart) {
        const prod = await Product.find({_id:productsCart[property].id})
        const qty = productsCart[property].qty
        prod.qty = productsCart[property].qty
        prodArr.push({...prod, qty})
    }
    /* prodArr.forEach(prod =>{
        amount += prod[0].price * prod.qty
    })
    prodArr.forEach(prod =>{
        prodTitle.push(prod[0].title)
    }) */
    let datos = req.user
    const {alias,email,firstName,lastName} = datos
    const newCart = new Cart()
    let productInCart = []
    prodArr.forEach((prod)=>{
        let newProdInCart = {
            date : new Date().toLocaleString(),
            title : prod[0].title,
            description : prod[0].description,
            code : prod[0].code,
            thumbnail : prod[0].thumbnail,
            price : prod[0].price,
            stock : prod[0].stock,
            qty : prod.qty
        }
        productInCart.push(newProdInCart)
    })
    newCart.email = email
    newCart.products = productInCart
    if(productInCart.length > 0){
        await newCart.save()
    }
    /* let cartInMoment = arrCart[arrCart.length - 1]
    let productsInCart = cartInMoment["products"]
    let amount = 0
    productsInCart.forEach(prod =>{
        amount += prod.price * prod.qty
    }) */
    /* if(amount != 0 & productsInCart.length !=0){
        let datos = req.user
        const {email,alias,firstName,lastName} = datos
        sendEnvoiceToEmail(email,amount,firstName,lastName,productsInCart) 
        next()
    } */
        sendEnvoiceToEmail(email,firstName,lastName) 
    res.render("listaContainer", {products, alias})
}

async function sendEnvoiceToEmail(email,firstName,lastName){
    let arrCart = await Cart.find({email:email})
    let cartInMoment =  arrCart[arrCart.length - 1] || arrCart
    let productsInCart = cartInMoment["products"]
    if(productsInCart != undefined){
        let amount = 0
    productsInCart.forEach(prod =>{
        amount += prod.price * prod.qty
    })
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: "vxjwhdkadlunfjnr",
        }
    })
    const mailOptions = {
        from: "Bikes",
        to: [email,process.env.ADMIN_EMAIL],
        subject: `Nuevo pedido de ${firstName} ${lastName}, ${email}`,
        html:`
        <div class="row my-5">
        <table class="table table-borderless factura">
        <thead>
            <tr>
                <th>Cant.</th>
                <th>Title</th>
                <th>Precio Unitario</th>
                <th>Importe</th>
            </tr>
        </thead>
        <tbody>
        ${productsInCart.map((item, i) => `
        <tr>
            <td>${item.qty}</td>
            <td>${item.title}</td>
            <td>${item.price}</td>
            <td>${item.price * item.qty}</td>
        </tr>
        `.trim()).join('')}
        </tbody>
        <tfoot>
            <tr>
                <th></th>
                <th></th>
                <th>Total Factura</th>
                <th>$${amount}</th>
            </tr>
        </tfoot>
        </table>
    </div>
        `
            }
            
            try {
                const info = await transporter.sendMail(mailOptions)
                
            } catch (error) {
                logger.error(error)
            }
    } 
        }
module.exports ={
    list,
    checkOut,
}