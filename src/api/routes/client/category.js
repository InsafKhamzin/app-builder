const express = require('express');
const router = express.Router({ mergeParams: true });
const CategoryService = require('../../../services/category');

const categoryService = new CategoryService();

// @route GET category/
// @desc get category tree

router.get('/', async (req, res) => {
    const appId = req.params.appId;
    const result = await categoryService.getAll({ appId });
    res.json(result);
});

module.exports = router;