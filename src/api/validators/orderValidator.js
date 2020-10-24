const { body, param } = require('express-validator');
const { validate } = require('./validate');

module.exports.orderAddValidation = [
    body('pickupId').custom((pickupId, { req }) => {
        if(!pickupId && !req.body.deliveryId){
            throw new Error('pickupId or deliveryId must exists');
        }
        if(pickupId && req.body.deliveryId){
            throw new Error('Only pickupId or deliveryId alone allowed');
        }
        return true;
    })
    .bail()
    .optional().isMongoId().withMessage('Invalid pickupId'),

    body('deliveryId', 'Invalid deliveryId').optional().isMongoId(),
    body('firstName', 'Invalid first name').if(body('deliveryId').exists()).isString(),
    body('lastName', 'Invalid last name').if(body('deliveryId').exists()).isString(),
    body('address', 'Invalid address').if(body('deliveryId').exists()).isString(),
    body('city', 'Invalid city').if(body('deliveryId').exists()).isString(),
    body('country', 'Invalid country').if(body('deliveryId').exists()).isString(),
    body('postalCode', 'Invalid postal code').if(body('deliveryId').exists()).isPostalCode('RU'),
    body('phone', 'Invalid phone number').if(body('deliveryId').exists()).isMobilePhone('ru-RU'),
    validate
];

module.exports.orderIdValidation = [
    param('orderId', 'Invalid orderId').isMongoId(),
    validate
];