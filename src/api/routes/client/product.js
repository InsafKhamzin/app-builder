const express = require('express');
const router = express.Router({ mergeParams: true });
const ProductService = require('../../../services/product');
const auth = require('../../middlewares/auth');

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

router.post('/favorite/:productId', [auth, productIdValidation],
    async (req, res) => {
        const { appId, productId } = req.params;
        const customerId = req.user.id;
        const result = await productService.toggleFavorite(appId, customerId, productId);
        res.json(result);
    });

router.get('/favorite/get', auth,
    async (req, res) => {
        const customerId = req.user.id;
        const result = await productService.getFavorites(customerId);
        res.json(result);
    });

module.exports = router;