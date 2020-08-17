const logger = require('../utils/logger');
const Product = require('../models/Product');
const ProductVariant = require('../models/ProductVariant');
const Category = require('../models/Category');
const Customer = require('../models/Customer');
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
                    product: newProductId,
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
                    product: product._id,
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
            const products = await Product.find(
                { app: appId },
                '_id name totalQuantity totalOrders totalReviews rating category mainImage fullPrice purchasePrice images')
                .populate('mainImage', 'small')
                .populate('images', 'small')
                .sort({ updatedAt: 'desc' });

            return products;
        } catch (error) {
            logger.error(`ProductService getAll ex: ${error.message}`);
            throw error;
        }
    }

    async getByCategory(appId, categoryId) {
        try {
            const products = await Product.find({ app: appId, category: categoryId },
                '_id name totalQuantity totalOrders totalReviews rating category mainImage fullPrice purchasePrice images')
                .populate('mainImage', 'small')
                .populate('images', 'small')
                .sort({ updatedAt: 'desc' });

            return products;
        } catch (error) {
            logger.error(`ProductService getByCategory ex: ${error.message}`);
            throw error;
        }
    }

    async getNewProducts(appId, quantity) {
        const products = await Product.find({ app: appId },
            '_id name totalQuantity totalOrders totalReviews rating category mainImage fullPrice purchasePrice images')
            .populate('mainImage', 'small')
            .populate('images', 'small')
            .sort({ createdAt: 'desc' })
            .limit(quantity);

        return products;
    }

    async getPopularProducts(appId, quantity) {
        const products = await Product.find({ app: appId },
            '_id name totalQuantity totalOrders totalReviews rating category mainImage fullPrice purchasePrice images')
            .populate('mainImage', 'small')
            .populate('images', 'small')
            .sort({ totalOrders: 'desc', rating: 'desc' })
            .limit(quantity);

        return products;
    }

    async getSaleProducts(appId, quantity) {
        const products = await Product.find({ app: appId, $expr: { $gt: ["$fullPrice", "$purchasePrice"] } },
            '_id name totalQuantity totalOrders totalReviews rating category mainImage fullPrice purchasePrice images')
            .populate('mainImage', 'small')
            .populate('images', 'small')
            .limit(quantity);

        return products;
    }

    async toggleFavorite(appId, customerId, productId) {
        const product = await Product.find({ app: appId, _id: productId });
        if (!product) {
            throw new ClientError('Product not found');
        }
        const customer = await Customer.findById(customerId);
        if (!customer.favorites) {
            customer.favorites = [];
        }
        const favoriteExistIdx = customer.favorites.findIndex(fav => fav.toString() === productId);
        if (favoriteExistIdx === -1) {
            customer.favorites.push(productId);
        } else {
            customer.favorites.splice(favoriteExistIdx, 1);
        }
        await customer.save();

        const customerPopulated = await customer
            .populate('favorites',
                '_id name totalQuantity totalOrders totalReviews rating category mainImage fullPrice purchasePrice images')
            .execPopulate();
        return customerPopulated.favorites;
    }

    async getFavorites(customerId) {
        const customer = await Customer.findById(customerId)
            .populate('favorites',
                '_id name totalQuantity totalOrders totalReviews rating category mainImage fullPrice purchasePrice images');
        return customer.favorites || [];
    }
}