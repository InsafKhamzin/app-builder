const { body, param } = require('express-validator');
const { validate } = require('./validate');

module.exports.categoryAddValidation = [
    body('name', 'Name is required').notEmpty(),
    validate
];

module.exports.categoryUpdateValidation = [
    param('categoryId', 'Invalid category id').isMongoId(),
    body('name', 'Name is required').notEmpty(),
    validate
];

module.exports.categoryDeleteValidation = [
    param('categoryId', 'Invalid category id').isMongoId(),
    validate
];

