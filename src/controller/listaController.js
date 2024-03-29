const axios = require('axios')
const Cart = require("../model/cartModel")
const nodemailer = require("nodemailer")
const Logger = require('../utils/logger.js')
const logger = new Logger()
async function getProductsWithAxios(){
    try {
        const products = await axios.get('http://localhost:8080/api/products')
        return products.data
    } catch (error) {
        logger.error(error)
    }
}

const getProducts = async(req,res) => {
    let datos = req.user
    const {alias} = datos
    let products = await getProductsWithAxios()
    res.render('listaContainer', {products,alias})
}

const checkOut = async (req,res,next)=>{
    const products = await getProductsWithAxios()
    const prodArr = []
    const productsCart = req.body.product
    for (const property in productsCart) {
        const prod = await await getProductsWithAxios()
        const qty = productsCart[property].qty
        prod.qty = productsCart[property].qty
        prodArr.push({...prod, qty})
    }
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

module.exports = {
    getProducts,
    checkOut
}
