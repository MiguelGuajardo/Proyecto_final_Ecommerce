const { Router } = require('express');
const ContainerFiles = require('../../containers/containerFileSystem');

class CartDaoFiles extends ContainerFiles {
  constructor(){
    super('cart.json')

  }

}

module.exports = CartDaoFiles;