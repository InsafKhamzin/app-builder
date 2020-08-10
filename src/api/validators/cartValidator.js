const { body } = require('express-validator');
const { validate } = require('./validate');

module.exports.cartAddValidation = [
    body('productVariantId', 'Invalid Product variant id').isMongoId(),
    body('quantity', 'Invalid quantity').isInt({ gt: 0 }),
    validate
];

