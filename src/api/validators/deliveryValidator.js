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