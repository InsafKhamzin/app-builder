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
            const apps = req.apps;

            //first check user apps in token
            let app = apps.find(x => x._id === appId);
            if (!app) {
                //if empty check in database
                app = await App.find({ _id: appId, user: userId });
            }
            if (!app) {
                throw new Error('Invalid app id')
            }
        }),
    validate
]; 