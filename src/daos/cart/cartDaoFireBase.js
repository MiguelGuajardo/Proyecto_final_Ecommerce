const ContainerFireBase = require("../../containers/containerFireBase")

class CartDaoFireBase extends ContainerFireBase{
    constructor(){
        super("carritos")
    }
    async getAll(){
        const querySnapshot = await this.query.get()
        let docs = querySnapshot.docs
        const response = docs.map(doc => ({
            id: doc.id,
            timestamp: doc.data().timestamp,
            productos: doc.data().productos
        }))

        return response
    }

    async addProduct(id, producto){
        let doc = this.query.doc(`${id}`)
        const item = await doc.get()
        let Item = {... item.data()}
        Item.productos.push(producto)
        await doc.update(Item)
    }

    async deleteProduct(carritoId, productoId){
        let doc = this.query.doc(`${carritoId}`)
        const item = await doc.get()
        let Item = {... item.data()}
        Item.productos = Item.productos.filter(prd => prd.id !== productoId)
        await doc.update(Item)
    }

}

module.exports = CartDaoFireBase