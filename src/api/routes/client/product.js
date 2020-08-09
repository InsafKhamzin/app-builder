const express = require('express');
const router = express.Router({ mergeParams: true });
const ProductService = require('../../../services/product');

const {
    productIdValidation,
    productGetByCategoryValidation
} = require('../../validators/productValidator');

const productService = new ProductService();

// @route GET product/:productId
// @desc get product

router.get('/:productId', productIdValidation,
    async (req, res) => {
        const { appId, productId } = req.params;
        const result = await productService.getById(appId, productId);
        res.json(result);
    });

// @route GET product/
// @desc get all products
// @query categoryId - all product by categoryId (optional)

router.get('/', productGetByCategoryValidation,
    async (req, res) => {
        const { appId } = req.params;
        const { categoryId } = req.query;

        let result;
        if (categoryId) {
            result = await productService.getByCategory(appId, categoryId);
        } else {
            result = await productService.getAll(appId);
        }
        res.json(result);
    });

module.exports = router;