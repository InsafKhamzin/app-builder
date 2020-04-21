const express = require('express');
const router = express.Router({ mergeParams: true });
const { check, param, validationResult } = require('express-validator');
const CategoryService = require('../../services/category');
const auth = require('../middlewares/auth');
const appToUser = require('../middlewares/appUserValidator');

const categoryService = new CategoryService();

router.post('/',
    [
        auth,
        param('appId', 'Invalid app id').isMongoId(),
        check('name', 'Name is required').notEmpty(),
        appToUser
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { name, parentCategoryId } = req.body;
            const appId = req.params.appId;

            const result = await categoryService.addCategory({ appId, name, parentCategoryId });
            res.json(result);
        } catch (error) {
            next(error);
        }
    });

router.put('/:categoryId',
    [
        auth,
        param('appId', 'Invalid app id').isMongoId(),
        param('categoryId', 'Invalid category id').isMongoId(),
        check('name', 'Name is required').notEmpty(),
        appToUser
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { name } = req.body;
            const appId = req.params.appId;
            const categoryId = req.params.categoryId;

            const result = await categoryService.updateCategory({ appId, categoryId, name });
            res.json(result);
        } catch (error) {
            next(error);
        }
    });

router.delete('/:categoryId',
    [
        auth,
        param('appId', 'Invalid app id').isMongoId(),
        param('categoryId', 'Invalid category id').isMongoId(),
        appToUser
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const appId = req.params.appId;
            const categoryId = req.params.categoryId;

            const result = await categoryService.deleteCategory({ appId, categoryId});
            res.json(result);
        } catch (error) {
            next(error);
        }
    });

router.get('/',
    [
        auth,
        param('appId', 'Invalid app id').isMongoId(),
        appToUser
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const appId = req.params.appId;
            const result = await categoryService.getAll({ appId });
            res.json(result);
        } catch (error) {
            next(error);
        }
    });

module.exports = router;