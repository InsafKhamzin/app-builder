const { param } = require('express-validator');
const { validate } = require('./validate');
const App = require('../../models/App');

module.exports.appIdValidation = [
    param('appId', 'Invalid app id').isMongoId(),
    validate
];

//use after auth middleware
module.exports.appIdToUserValidation = [
    param('appId', 'Invalid app id')
        .isMongoId()
        .bail()
        .custom(async (appId, { req }) => {
            const userId = req.user.id;
            const app = await App.findById(appId);
            if (!app) {
                throw new Error('App not found')
            }
            if (!app.user || app.user.toString() !== userId) {
                throw new Error('Access denied')
            }
        }),
    validate
]; 