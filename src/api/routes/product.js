const express = require('express');
const router = express.Router({ mergeParams: true });
const { check, param, query, validationResult } = require('express-validator');
const ProductService = require('../../services/product');
const auth = require('../middlewares/auth');
const appToUser = require('../middlewares/appUserValidator');

const productService = new ProductService();

router.post('/',
    [
        auth,
        param('appId', 'Invalid app id').isMongoId(),
        check('categoryId', 'Invalid category id').isMongoId(),
        check('name', 'Name is required').notEmpty(),
        check('price', 'Invalid price').isDecimal(),
        appToUser
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { name, description, price, categoryId } = req.body;
            const appId = req.params.appId

            const result = await productService.addProduct({ appId, name, description, price, categoryId });
            res.json(result);
        } catch (error) {
            next(error);
        }
    });


router.delete('/:productId',
    [
        auth,
        param('appId', 'Invalid app id').isMongoId(),
        param('productId', 'Invalid product id').isMongoId(),
        appToUser
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { appId, productId } = req.params;

            await productService.deleteProduct(appId, productId);
            res.status(200).send();
        } catch (error) {
            next(error);
        }
    });

router.get('/:productId',
    [
        auth,
        param('appId', 'Invalid app id').isMongoId(),
        param('productId', 'Invalid product id').isMongoId(),
        appToUser
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { appId, productId } = req.params;

            const result = await productService.getById(appId, productId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    });

router.get('/',
    [
        auth,
        param('appId', 'Invalid app id').isMongoId(),
        query('categoryId', 'Invalid category id').optional().isMongoId(),
        appToUser
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
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