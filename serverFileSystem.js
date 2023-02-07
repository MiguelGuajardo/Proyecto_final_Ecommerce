const express = require("express")
const {engine: exphbs} = require("express-handlebars")
const PORT = process.env.PORT || 8080
const auth = require("./src/routes/authRouter")


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
/* HandleBars */
app.engine("hbs", exphbs({extname: ".hbs", defaultLayout: "main.hbs"}))
app.set("view engine", ".hbs")

app.use(express.static('./public'))

//imports dao FileSystem
const ProductController = require('./src/controller/productControllerFileSystem');
const CartController = require('./src/controller/cartControllerFileSystem');
//routers de FileSystem
const productFileSystem = new ProductController()
const cartFileSystem = new CartController()

app.use("/", auth)
app.use('/api/productos', productFileSystem.getRouter());
app.use('/api/carrito', cartFileSystem.getRouter());
app.get("/info",(req,res)=>{
    res.render("info")
})

app.listen(PORT, ()=>{
    console.log(`Escuchando en puerto ${PORT}`)
})
app.on("error",(error)=>{
    console.log(`Error en servidor ${error}`)
})