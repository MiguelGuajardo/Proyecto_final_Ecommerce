const express = require('express')
const {config} = require("./src/config/index")
const Logger = require("./src/utils/logger")
const logger = new Logger()
const {engine: exphbs} = require("express-handlebars")
const INFO = require("./src/utils/info")
const cluster = require('cluster');
const os = require('os')
const productsRouter = require('./src/routes/productsRoute.js')
const listaRouter = require('./src/routes/listaRouter.js')
const auth = require('./src/routes/authRouter.js')
const session = require("express-session")
const cookieParser = require("cookie-parser")
const passport = require("passport")
const MongoStore = require("connect-mongo")
require('./src/data/database.js')
require("./src/passport/local-auth")

const app = express()

/* Config hbs */
app.engine("hbs", exphbs({extname: ".hbs", defaultLayout: "main.hbs"}))
app.set("view engine", ".hbs")

/* middlewares */
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(express.static('./public'))

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



/* ROUTES */

/* Ruta auth */
app.use("/", auth)
/* Ruta productos */
app.use('/api/products', productsRouter)
/* Ruta lista */
app.use('/lista', listaRouter)
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
    const io = require('socket.io')(server);
    server.on("error", (error) => logger.error(`Error en servidor ${error}`));

    io.on('connection', onConnected);
    function onConnected(socket){
        console.log('User',socket.id);
        socketsConnected.add(socket.id)

        io.emit('clients-total',socketsConnected.size)

        socket.on('disconnect', ()=>{
            console.log(`User ${socket.id} disconnected`)
            socketsConnected.delete(socket.id)
            io.emit('clients-total',socketsConnected.size)
        })

        socket.on('message', (data)=>{
            socket.broadcast.emit('chat-message', data)
        })
        socket.on('feedback', (data)=>{
            socket.broadcast.emit('feedback', data)
        })
    }
}

let socketsConnected = new Set()