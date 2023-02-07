const admin = require("firebase-admin")
const serviceAccount = require("../../db/proyectecommerce-bbdd5-firebase-adminsdk-jofzk-3f09c28a64.json");

class ContainerFireBase{
    constructor(collectionName){
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        })
        this.db = admin.firestore()
        this.query = this.db.collection(collectionName)
    }
    async getById(id){
        let doc = this.query.doc(`${id}`)
        const item = await doc.get()
        return item.data()
    }
    async add(item){
        const querySnapshot = await this.query.get()
        let docs = querySnapshot.docs
        let doc = this.query.doc(`${docs.length}`)
        item.id = docs.length
        await doc.create(item)
    }

    async update(id, item){
        let doc = this.query.doc(`${id}`)
        await doc.update(item)
        return "item actualizado correctamente"
    }

    async delete(id){
        let doc = this.query.doc(`${id}`)
        await doc.delete()
        return "item eliminado correctamente"
    }    
}
module.exports = ContainerFireBase