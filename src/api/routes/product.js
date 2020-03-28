const express = require('express');
const router = express.Router({mergeParams: true});
const { check, param, validationResult } = require('express-validator');
const ProductService = require('../../services/product');
const auth = require('../middlewares/auth');
const ObjectId = require('mongoose').Types.ObjectId;

const productService = new ProductService();

router.post('/',
    [
        auth,
        param('appId', 'Invalid app id').isMongoId(),
        check('name', 'Name is required').notEmpty(),
        check('price', 'Invalid price').isDecimal(),
    ],
    async (req, res, next) => {
        try {
            console.log(req.params);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const model = {
                appId: req.params.appId,
                userId: req.user.id,
                ...req.body
            }

            const result = await productService.addProduct(model);
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
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { appId, productId } = req.params;

            await productService.deleteProduct(appId, productId, req.user.id);
            res.status(200).send();
        } catch (error) {
            next(error);
        }
    });

router.get('/:productId',
    [
        auth,
        param('appId', 'Invalid app id').isMongoId(),
        param('productId', 'Invalid product id').isMongoId()
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { appId, productId } = req.params;

            const result = await productService.getById(appId, productId, req.user.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    });

    router.get('/',
    [
        auth,
        param('appId', 'Invalid app id').isMongoId()
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { appId } = req.params;

            const result = await productService.getAll(appId, req.user.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    });

module.exports = router;