const express = require('express');
const router = express.Router({ mergeParams: true });
const CategoryService = require('../../../services/category');

const {
    categoryAddValidation,
    categoryUpdateValidation,
    categoryDeleteValidation
} = require('../../validators/categoryValidator');


const categoryService = new CategoryService();

// @route POST category/
// @desc create category
// @param name - category name
// @param parentCategoryId - parent category (optional)

router.post('/', categoryAddValidation,
    async (req, res, next) => {
        try {
            const { name, parentCategoryId } = req.body;
            const appId = req.params.appId;

            const result = await categoryService.addCategory({ appId, name, parentCategoryId });
            res.json(result);
        } catch (error) {
            next(error);
        }
    });

// @route PUT category/:categoryId'
// @desc update category

router.put('/:categoryId', categoryUpdateValidation,
    async (req, res, next) => {
        try {
            const { name } = req.body;
            const appId = req.params.appId;  
            const categoryId = req.params.categoryId;

            const result = await categoryService.updateCategory({ appId, categoryId, name });
            res.json(result);
        } catch (error) {
            next(error);
        }
    });

// @route DELETE category/:categoryId'
// @desc delete category

router.delete('/:categoryId', categoryDeleteValidation,
    async (req, res, next) => {
        try {
            const appId = req.params.appId;
            const categoryId = req.params.categoryId;

            const result = await categoryService.deleteCategory({ appId, categoryId });
            res.json(result);
        } catch (error) {
            next(error);
        }
    });

// @route GET category/
// @desc get category tree

router.get('/', async (req, res, next) => {
    try {
        const appId = req.params.appId;

        const result = await categoryService.getAll({ appId });
        res.json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;