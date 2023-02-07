const express = require('express');
const PORT = process.env.PORT || 8080
const app = express()
const auth = require("./src/routes/authRouter")
const {config} = require("./src/config/index")
const ProductsDaoMongo = require('./src/daos/products/prodDaoMongoDB');
const CartDaoMongo = require('./src/daos/cart/cartDaoMongo');
const productMongo = new ProductsDaoMongo()
const cartMongo = new CartDaoMongo()
const Logger = require("./src/utils/logger")
const logger = new Logger()
const {engine: exphbs} = require("express-handlebars")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const passport = require("passport")
const MongoStore = require("connect-mongo")


/* Config hbs */
app.engine("hbs", exphbs({extname: ".hbs", defaultLayout: "main.hbs"}))
app.set("view engine", ".hbs")

/* middlewares */
app.use(express.json())
app.use(express.urlencoded({extended:false}))
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true }
const sessionConfig ={
    store: MongoStore.create({
        mongoUrl: config.DATABASE.mongo.mongoUrl,
        dbName: config.DATABASE.mongo.mongoDbName,
        mongoOptions,
        ttl: 60,
        collectionName: config.DATABASE.mongo.mongoCollectionName
    }),
    secret: config.DATABASE.mongo.mongoSecret,
    resave: false,
    saveUninitialized: false,
    rolling:true,
    cookie: {
        maxAge:60000
    }
}
app.use(session(sessionConfig))

app.use(session({
    secret: config.DATABASE.mongo.mongoSecret,
    resave: false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser("secrett"))

app.use(express.static('./public'))


/* ROUTES */
app.use("/", auth)
app.use('/api/productos', productMongo.getRouter());
app.use('/api/carrito', cartMongo.getRouter());


app.listen(PORT, ()=>{
    console.log(`Escuchando en puerto ${PORT}`)
})
app.on("error",(error)=>{
    console.log(`Error en servidor ${error}`)
})