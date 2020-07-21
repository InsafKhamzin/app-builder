const logger = require('../utils/logger');
const Category = require('../models/Category');
const Product = require('../models/Product');
const ClientError = require('../common/clientError');
const mongoose = require('mongoose');
const {getCache, putCache} = require('../utils/cacheUtil');

module.exports = class CategoryService {

    async addCategory({ appId, parentCategoryId, name }) {
        try {
            const newCategory = new Category({
                _id: mongoose.Types.ObjectId(),
                app: appId,
                name: name,
                image: "", //TODO
                productCount: 0
            });

            if (parentCategoryId) {
                const parentCategory = await Category.findOne({ app: appId, _id: parentCategoryId });
                if (!parentCategory) {
                    throw new ClientError('Parent category not found', 404);
                }

                //check if parent category already contains products. so we cant add subcategory
                const products = await Product.findOne({ app: appId, category: parentCategoryId });
                if (products) {
                    throw new ClientError('Parent category contains products', 400);
                }

                parentCategory.children.unshift(newCategory._id);
                newCategory.parent = parentCategory._id;
                await parentCategory.save();
            }
            await newCategory.save();

            const categoryTree = await Category.find({ app: appId, parent: null });
            putCache('categoryTree' + appId, categoryTree);

            return categoryTree;
        } catch (error) {
            logger.error(`CategoryService addCategory ex: ${error.message}`);
            throw error;
        }
    }

    async updateCategory({ appId, categoryId, name }) {
        try {
            const category = await Category.findOne({ app: appId, _id: categoryId });
            if (!category) {
                throw new ClientError('Category not found', 404);
            }
            category.name = name;
            await category.save();

            const categoryTree = await Category.find({ app: appId, parent: null });
            putCache('categoryTree' + appId, categoryTree);

            return categoryTree
        } catch (error) {
            logger.error(`CategoryService updateCategory ex: ${error.message}`);
            throw error;
        }
    }

    async deleteCategory({ appId, categoryId }) {
        try {
            const products = await Product.findOne({ app: appId, category: categoryId });
            if (products) {
                throw new ClientError('Category contains products', 400);
            }

            await Category.findOneAndDelete({ app: appId, _id: categoryId });
            const categoryTree = await Category.find({ app: appId, parent: null });
            putCache('categoryTree' + appId, categoryTree);

            return categoryTree;
        } catch (error) {
            logger.error(`CategoryService deleteCategory ex: ${error.message}`);
            throw error;
        }
    }

    async getAll({ appId }) {
        try {
            let categoryTree = getCache('categoryTree' + appId);
            if(!categoryTree){
                categoryTree = await Category.find({ app: appId, parent: null });
                putCache('categoryTree' + appId, categoryTree);
            }
            return categoryTree;
        } catch (error) {
            logger.error(`CategoryService getAll ex: ${error.message}`);
            throw error;
        }
    }

}