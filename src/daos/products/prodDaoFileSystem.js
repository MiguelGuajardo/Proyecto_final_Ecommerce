const { Router } = require('express');
const ContainerFiles = require('../../containers/containerFileSystem');

class ProductsDaoFiles extends ContainerFiles{
    constructor(){
        super('products.json')
    }
}
module.exports = ProductsDaoFiles; 