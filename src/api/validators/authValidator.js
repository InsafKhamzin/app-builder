const { body } = require('express-validator');
const { validate } = require('./validate');

module.exports.registerValidation = [
    body('email', 'Invalid email format').isEmail(),
    body('password', 'Password is required').notEmpty(),
    validate
];

module.exports.loginValidation = [
    body('email', 'Invalid email format').isEmail(),
    body('password', 'Password is required').notEmpty(),
    validate
];

module.exports.tokenValidation = [
    body('refreshToken', 'Refresh token is required').notEmpty(),
    validate
];