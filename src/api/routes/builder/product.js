const express = require('express');
const router = express.Router({ mergeParams: true });
const ProductService = require('../../../services/product');

const {
    productAddValidation,
    productIdValidation,
    productGetByCategoryValidation
} = require('../../validators/productValidator');

const productService = new ProductService();

// @route POST product/
// @desc add product
// @param name
// @param description
// @param price
// @param categoryId

router.post('/', productAddValidation,
    async (req, res, next) => {
        try {
            const { name, description, price, categoryId, images } = req.body;
            const appId = req.params.appId

            const result = await productService.addProduct({ appId, name, description, price, categoryId, images });
            res.json(result);
        } catch (error) {
            next(error);
        }
    });

// @route DELETE product/:productId
// @desc delete product

router.delete('/:productId', productIdValidation,
    async (req, res, next) => {
        try {
            const { appId, productId } = req.params;

            await productService.deleteProduct(appId, productId);
            res.status(200).send();
        } catch (error) {
            next(error);
        }
    });

// @route GET product/:productId
// @desc get product

router.get('/:productId', productIdValidation,
    async (req, res, next) => {
        try {
            const { appId, productId } = req.params;

            const result = await productService.getById(appId, productId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    });

// @route GET product/
// @desc get all products
// @query categoryId - all product by categoryId (optional)

router.get('/', productGetByCategoryValidation,
    async (req, res, next) => {
        try {
            const { appId } = req.params;
            const { categoryId } = req.query;

            let result;
            if (categoryId) {
                result = await productService.getByCategory(appId, categoryId);
            } else {
                result = await productService.getAll(appId);
            }

            res.json(result);
        } catch (error) {
            next(error);
        }
    });

module.exports = router;