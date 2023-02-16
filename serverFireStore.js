const express = require("express")
const app = express()
const PORT = process.env.PORT || 8080
const Logger = require("./src/utils/logger")
const logger = new Logger()

const cartController = require("./src/controller/cartControllerFireBase")
const cartFireBase = new cartController()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/carrito", cartFireBase.getRouter())

  app.listen(PORT, ()=>{
    logger.info(`Escuchando en puerto ${PORT}`)
})
app.on("error",(error)=>{
  logger.error(`Error en servidor ${error}`)
})