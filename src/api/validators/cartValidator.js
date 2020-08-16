const { body } = require('express-validator');
const { validate } = require('./validate');

module.exports.cartUpdateValidation = [
    body('items', 'Must be an array').isArray(),
    body('items.*.productVariantId', 'Invalid product variant id').isMongoId().bail(),
    body('items.*.quantity', 'Invalid quantity').isInt({ gt: 0 }).bail(),
    body('items').custom((items) => {
        const itemsSet = new Set();
        //check duplicates
        items.forEach(item =>{
            if(itemsSet.has(item.productVariantId)){
                throw new Error('No duplicates allowed')
            }
            itemsSet.add(item.productVariantId);
        });
        return true;
    }),
    validate
];

