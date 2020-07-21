const { body, param, query, oneOf } = require('express-validator');
const { validate } = require('./validate');

module.exports.productAddValidation = [
    body('categoryId', 'Invalid category id').isMongoId(),
    body('name', 'Name is required').notEmpty(),

    //if images field exist then it must be an array with mongoDb ids.
    body('images')
        .if(body('images').exists())
        .isArray({ min: 1 }).withMessage('Must be a non-empty array'),
    body('images.*', 'Invalid image id').isMongoId(),

    //characteristtics validation
    body('characteristics')
        .if(body('characteristics').exists())
        .isArray({ min: 1 }).withMessage('Must be a non-empty array'),
    body('characteristics.*._id', 'Invalid characteristic id').isMongoId(),
    body('characteristics.*.name', 'Characteristic name is required').notEmpty(),
    body('characteristics.*.options').isArray({ min: 1 }).withMessage('Must be a non-empty array'),
    body('characteristics.*.options.*._id', 'Invalid characteristic option id').isMongoId(),
    body('characteristics.*.options.*.name', 'Characteristic option name is required').notEmpty(),
    body('characteristics.*.options.*.value', 'Characteristic option value is required').notEmpty(),

    //variants validation
    body('variants', 'Variants must exist')
    .exists()
    .bail()
    .custom((variants, {req}) =>{
        if(!req.body.characteristics && variants.length > 1){
            throw Error("Can't be more than one variants[] if no characteristics[]");
        }
        return true;
    }),

    //check if values provided in variants[] associated with info in characteristics
    body('variants.*.characteristics.*').custom((variant, {req}) =>{
        const associateCharIdx = req.body.characteristics.findIndex(x => x._id == variant.characteristic);
        if(associateCharIdx === -1){
            throw Error("No associate characteristic in characteristics[]");
        }
        const associateOptionIdx = req.body.characteristics[associateCharIdx].options.findIndex(x => x._id == variant.option);
        if(associateOptionIdx === -1){
            throw Error("No associate option in characteristics[].options[]");
        }
        return true;
    }),    

    body('variants.*.price', 'Invalid variants price').isNumeric(),
    body('variants.*.quantity', 'Invalid variants quantity').isNumeric(),

    validate
];

module.exports.productIdValidation = [
    param('productId', 'Invalid product id').isMongoId(),
    validate
];

module.exports.productGetByCategoryValidation = [
    query('categoryId', 'Invalid category id').optional().isMongoId(),
    validate
];