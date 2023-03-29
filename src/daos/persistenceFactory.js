const {config} = require('../config/index.js');
const Logger = require('../utils/logger.js')
const logger = new Logger()

const ProductsMemory = require('./productsDaoMemory.js')
const ProductsFile = require('./productsDaoFile.js')
const ProductsMongo = require('./productsDaoMongo')

class PersistenteceFactory {
    static getPersistenece = async () => {
        switch (config.app.persistence) {
            case 'MEMORY':
                logger.info('Dao Memory')
                return new ProductsMemory()

            case 'FILE':
                logger.info('Dao File')
                return new ProductsFile()
            
                case 'MONGO':
                logger.info('Dao Mongo')
                return new ProductsMongo()
        }
    }
}
module.exports = PersistenteceFactory