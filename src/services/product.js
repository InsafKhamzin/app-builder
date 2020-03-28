const logger = require('../utils/logger');
const App = require('../models/App');
const Product = require('../models/Product');
const ClientError = require('../common/clientError');

module.exports = class ProductService {
    async addProduct({ appId, userId, name, description, price }) {
        try {
            const app = await App.findById(appId);
            validateAppAndUser(app, userId);

            const newProduct = new Product({
                app: app._id,
                name: name,
                description: description,
                price: price,
                currency: 'RUB', //TODO
            });
            const product = await newProduct.save();
            return product;
        } catch (error) {
            logger.error(`ProductService addProduct ex: ${error.message}`);
            throw error;
        }
    }

    async deleteProduct(appId, productId, userId) {
        try {
            const app = await App.findById(appId);
            validateAppAndUser(app, userId);

            await Product.findByIdAndDelete(productId);
        } catch (error) {
            logger.error(`ProductService addProduct ex: ${error.message}`);
            throw error;
        }
    }

    async getById(appId, productId, userId) {
        try {
            const app = await App.findById(appId);
            validateAppAndUser(app, userId);

            const product = await Product.findById(productId);
            if(!product){
                throw new ClientError('Product not found', 404);
            }
            return product;
        } catch (error) {
            logger.error(`ProductService addProduct ex: ${error.message}`);
            throw error;
        }
    }

    async getAll(appId, userId) {
        try {
            const app = await App.findById(appId);
            validateAppAndUser(app, userId);

            const products = Product.find({ app: appId });
            return products;
        } catch (error) {
            logger.error(`ProductService addProduct ex: ${error.message}`);
            throw error;
        }
    }
}

function validateAppAndUser(app, userId) {
    if (!app) {
        throw new ClientError('App not found', 404)
    }
    if (!app.user || app.user.toString() !== userId) {
        throw new ClientError('App does not belong to user', 403)
    }
}