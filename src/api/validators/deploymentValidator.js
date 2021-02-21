const { body } = require('express-validator');
const { validate } = require('./validate');

module.exports.deploymentAddValidator = [
    body('name', 'Invalid name').notEmpty(),
    body('description', 'Invalid description').notEmpty(),
    body('icon', 'Invalid image id').isMongoId(),
    body('screenshots', 'Invalid image ids').isArray(),
    body('screenshots.*', 'Invalid image id').isMongoId(),
    body('notifyBot', 'Invalid image id').optional().isBoolean(),
    validate
];