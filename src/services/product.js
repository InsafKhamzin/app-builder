const logger = require('../utils/logger');
const Product = require('../models/Product');
const Category = require('../models/Category');
const ClientError = require('../common/clientError');

module.exports = class ProductService {
    async addProduct({ appId, name, description, price, categoryId, images }) {
        try {
            const category = await Category.findOne({ app: appId, _id: categoryId });
            if (!category) {
                throw new ClientError('Category not found', 404);
            }
            if (category.children && category.children.length > 0) {
                throw new ClientError('Category contains subcategories', 400);
            }

            const newProduct = new Product({
                app: appId,
                name: name,
                description: description,
                price: price,
                currency: 'RUB', //TODO
                category: category._id,
                images
            });
            const product = await newProduct.save();
            const productWithImages = await product.populate('images').execPopulate();

            //increment number of products in category
            category.productCount++;
            await category.save();

            return productWithImages;
        } catch (error) {
            logger.error(`ProductService addProduct ex: ${error.message}`);
            throw error;
        }
    }

    async deleteProduct(appId, productId) {
        try {
            const product = await Product.findOneAndDelete({ app: appId, _id: productId });
            if (product && product.category) {
                const category = await Category.findById(product.category);
                category.productCount--;
                await category.save();
            }
        } catch (error) {
            logger.error(`ProductService deleteProduct ex: ${error.message}`);
            throw error;
        }
    }

    async getById(appId, productId) {
        try {
            const product = await Product.findOne({ app: appId, _id: productId });
            if (!product) {
                throw new ClientError('Product not found', 404);
            }
            return product;
        } catch (error) {
            logger.error(`ProductService getById ex: ${error.message}`);
            throw error;
        }
    }

    async getAll(appId) {
        try {
            const products = Product.find({ app: appId });
            return products;
        } catch (error) {
            logger.error(`ProductService getAll ex: ${error.message}`);
            throw error;
        }
    }

    async getByCategory(appId, categoryId) {
        try {
            const products = Product.find({ app: appId, category: categoryId });
            return products;
        } catch (error) {
            logger.error(`ProductService getByCategory ex: ${error.message}`);
            throw error;
        }
    }
}