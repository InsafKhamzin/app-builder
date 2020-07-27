const logger = require('../utils/logger');
const Product = require('../models/Product');
const ProductVariant = require('../models/ProductVariant');
const Category = require('../models/Category');
const ClientError = require('../common/clientError');
const mongoose = require('mongoose');

module.exports = class ProductService {
    async addProduct({ appId, name, description, categoryId, mainImage, images, characteristics, variants }) {
        try {
            const category = await Category.findOne({ app: appId, _id: categoryId });
            if (!category) {
                throw new ClientError('Category not found', 404);
            }
            if (category.children && category.children.length > 0) {
                throw new ClientError('Category contains subcategories', 400);
            }
            const newProductId = mongoose.Types.ObjectId();

            const variantIds = []
            const productVariants = variants.map(variant => {
                const newVariantId = mongoose.Types.ObjectId();
                variantIds.push(newVariantId);
                return new ProductVariant({
                    _id: newVariantId,
                    productId: newProductId,
                    quantity: variant.quantity,
                    fullPrice: variant.price,
                    purchasePrice: variant.price,
                    characteristics: variant.characteristics
                });
            });

            //min amount
            const minPrice = variants.reduce(
                (max, variant) => (parseInt(variant.price) > max ? parseInt(variant.price) : max),
                parseInt(variants[0].price)
              );

            const newProduct = new Product({
                _id: newProductId,
                app: appId,
                name: name,
                description: description,
                category: category._id,
                mainImage,
                images,
                fullPrice: minPrice,
                purchasePrice: minPrice,
                currency: 'RUB',
                characteristics: characteristics,
                variants: variantIds
            });

            //TODO make a transaction
            //saving product
            const product = await newProduct.save();
            //saving product variants
            await ProductVariant.insertMany(productVariants);
            //increment number of products in category
            category.productCount++;
            await category.save();

            const productPopulated = await product
                .populate('images')
                .populate('mainImage')
                .populate('variants')
                .execPopulate();

            return productPopulated;
        } catch (error) {
            logger.error(`ProductService addProduct ex: ${error.message}`);
            throw error;
        }
    }

    async updateProduct({ appId, productId, name, description, categoryId, mainImage, images, characteristics, variants }) {
        try {
            const product = await Product.findById(productId);
            if (!product) {
                throw new ClientError('Product not found', 404)
            }
            const category = await Category.findOne({ app: appId, _id: categoryId });
            if (!category) {
                throw new ClientError('Category not found', 404);
            }
            if (category.children && category.children.length > 0) {
                throw new ClientError('Category contains subcategories', 400);
            }

            const variantIds = []
            const productVariants = variants.map(variant => {
                const newVariantId = mongoose.Types.ObjectId();
                variantIds.push(newVariantId);
                return new ProductVariant({
                    _id: newVariantId,
                    productId: product._id,
                    quantity: variant.quantity,
                    fullPrice: variant.price,
                    purchasePrice: variant.price,
                    characteristics: variant.characteristics
                });
            });

            const minPrice = variants.reduce(
                (max, variant) => (parseInt(variant.price) > max ? parseInt(variant.price) : max),
                parseInt(variants[0].price)
              );

            product.name = name;
            product.description = description;
            product.mainImage = mainImage;
            product.images = images;
            product.fullPrice = minPrice,
            product.purchasePrice = minPrice,
            product.characteristics = characteristics;
            product.variants = variantIds;

            const productUpdated = await product.save();
            await ProductVariant.deleteMany({ productId: product._id });
            await ProductVariant.insertMany(productVariants);
            await category.save();

            const productPopulated = await productUpdated
                .populate('images')
                .populate('mainImage')
                .populate('variants')
                .execPopulate();

            return productPopulated;
        } catch (error) {
            logger.error(`ProductService updateProduct ex: ${error.message}`);
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
            const product = await Product.findOne({ app: appId, _id: productId })
                .populate('images')
                .populate('mainImage')
                .populate('variants')
                .populate('category');
                
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
            const products = Product.find(
                { app: appId },
                '_id name totalQuantity totalOrders totalReviews rating category mainImage fullPrice purchasePrice')
                .populate('mainImage', 'small')
                .sort({ updatedAt: 'desc' });

            return products;
        } catch (error) {
            logger.error(`ProductService getAll ex: ${error.message}`);
            throw error;
        }
    }

    async getByCategory(appId, categoryId) {
        try {
            const products = Product.find({ app: appId, category: categoryId },
                '_id name totalQuantity totalOrders totalReviews rating category mainImage fullPrice purchasePrice')
                .populate('mainImage', 'small')
                .sort({ updatedAt: 'desc' });

            return products;
        } catch (error) {
            logger.error(`ProductService getByCategory ex: ${error.message}`);
            throw error;
        }
    }
}