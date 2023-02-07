const fs = require('fs');
const path = __dirname+"/../api/";

class ContainerFiles {
    constructor(name) {
        this.fileName = name
    };
    
    async getAll() {
        try {
        if(fs.existsSync(path+this.fileName)) {
            const json = await fs.promises.readFile(path+this.fileName, "utf-8");
            const array = JSON.parse(json);
            return array
        } else {
            await fs.promises.writeFile(path+this.fileName, "[]", 'utf-8');
            console.log({ Msg: "Created file" });
            return []
        }
        } catch (error) {
        console.log({Error: error});
        }
    };
    async save(product){
        try {
            if (fs.existsSync(path+this.fileName)) {
                let allFiles = await this.getAll()
                let lastId = allFiles.reduce((acc, item) => item.id > acc ? acc = item.id : acc, 0)
                let newFile
                if (this.fileName == 'products.json') {
                    newFile = {
                        id: lastId + 1,
                        date: new Date().toLocaleString(),
                        ...product
                    }
                } else {
                    newFile = {
                        id: lastId + 1,
                        date: new Date().toLocaleString(),
                        products: []
                    }
                }
                allFiles.push(newFile)
                await fs.promises.writeFile(path+this.fileName, JSON.stringify(allFiles, null, 2));
                return newFile.id
            } else {
                let newFile
                if (this.fileName == 'products.json') {
                    newFile = {
                        id: 1,
                        date: new Date().toLocaleString(),
                        ...product
                    }
                } else {
                    newFile = {
                        id: 1,
                        date: new Date().toLocaleString(),
                        products: []
                    }
                }
                await fs.promises.writeFile(path+this.fileName, JSON.stringify([newFile, null, 2]))
                return 1
            }
        } catch (error) {
            console.log({Error: error})
        }
    }
    async getByID(id) {
        try {
            if(fs.existsSync(path+this.fileName)){
                let allFiles = await this.getAll()
                let obj = allFiles.find((prod) => prod.id === id)
                return obj
            }
        } catch (error) {
            throw "No se encontró el producto" + error;
        }
    }
    async update(id, product) {
        try {
            let allFiles = await this.getAll();
            let index = allFiles.findIndex((prod) => prod.id == id);
            if (index >= 0) {
                allFiles[index] = {id:id,date: new Date().toLocaleString(),...product};
                
                await fs.promises.writeFile(path+this.fileName, JSON.stringify(allFiles, null, 2));
                return {status: "éxito", description: "el producto se modificó con éxito"}
            }
            
        } catch (error) {
            console.log({Error: error})
        }
    }
    async deleteByID(id){
        let allFiles = await this.getAll()
        let prod = allFiles.filter((el) => el.id === id)
        if (prod) {
            try {
                if(fs.existsSync(path+this.fileName)){
                    let product = allFiles.filter((el) => el.id !== id)
                    await fs.promises.writeFile(path+this.fileName, JSON.stringify(product, null, 2));
                    return product
                }
            } catch (error) {
                throw "No se encontró el producto" + error;
            }
        }else{
            throw "No se encontró el producto" + error;
        }
        
    }
};

module.exports = ContainerFiles;