const { body, param } = require('express-validator');
const { validate } = require('./validate');

module.exports.pickupAddValidator = [
    body('phone', 'Invalid phone number').optional().isMobilePhone('ru-RU'),
    body('address', 'Invalid address').notEmpty(),
    validate
];

module.exports.pickupIdValidator = [
    param('pickupId', 'Invalid pickup id').isMongoId(),
    validate
];

module.exports.deliveryAddValidator = [
    body('name', 'Invalid name').notEmpty(),
    body('price', 'Invalid price').isNumeric(),
    body('freeFrom', 'Invalid freeFrom').optional().isNumeric(),
    validate
];

module.exports.deliveryIdValidator = [
    param('deliveryId', 'Invalid delivery id').isMongoId(),
    validate
];