const express = require('express');
const PORT = process.env.PORT || 8080
const app = express()
const auth = require("./src/routes/authRouter")
const lista = require("./src/routes/listaRouter")
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
const INFO = require("./src/utils/info")
const cluster = require('cluster');
const os = require('os')
require("./src/passport/local-auth")


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
/* Ruta auth */
app.use("/", auth)
/* Ruta Agregar Productos Admin */
app.use('/api/productos', productMongo.getRouter());
/* Ruta Agregar productos usuarios */
app.use('/api/carrito', cartMongo.getRouter());
/* Ruta intefaz Ecommerce */
app.use("/lista", lista)
/* Ruta info Sistema */
app.get("/info", (req,res)=>{
    const data = INFO
    res.render("info", {data})
})
/* Ruta 404 */
app.all("*",(req,res)=>{
    const {method, url} = req
    logger.warn(`Ruta ${method} ${url} no implementada`)
    res.render("404")
})


if (config.SERVER.MODE === 'CLUSTER' && cluster.isPrimary) {        
    const numCPUs = os.cpus().length

    logger.info(`CLUSTER corriendo en nodo primario ${process.pid} - Puerto ${config.SERVER.PORT}`)
    
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', worker => {
        logger.warn(`Worker ${worker.process.pid} finalizado`)
        cluster.fork()
    });
        
} else {
    const server = app.listen(config.SERVER.PORT, () => {
        logger.info(`Proceso #${process.pid} escuchando en el puerto ${config.SERVER.PORT}`)
    });
    server.on("error", (error) => console.log(`Error en servidor ${error}`));
}