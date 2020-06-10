const { body, param, query, oneOf } = require('express-validator');
const { validate } = require('./validate');

module.exports.productAddValidation = [
    body('categoryId', 'Invalid category id').isMongoId(),
    body('name', 'Name is required').notEmpty(),
    body('price', 'Invalid price').isDecimal(),
    body('images')
        .if(body('images').exists())
        .isArray({min: 1}).withMessage("Must be a non-empty array"),
    body('images.*', 'Invalid image id').isMongoId(),
    validate
];

module.exports.productIdValidation = [
    param('productId', 'Invalid product id').isMongoId(),
    validate
];

module.exports.productGetByCategoryValidation = [
    query('categoryId', 'Invalid category id').optional().isMongoId(),
    validate
];