const { body, param } = require('express-validator');
const { validate } = require('./validate');

const compilationIdValidation = param('compilationId', 'Invalid compilation id').isMongoId();

const categoryIdValidation =
    body('categoryId', 'Invalid category id')
        .isMongoId()
        .bail()
        .custom(async (categoryId, { req }) => {
            const category = await Category.findOne({ _id: categoryId, app: req.params.appId });
            if (!category) {
                throw new Error('Invalid category id');
            }
            if (category.children && category.children.length > 0) {
                throw new Error('Category has children categories');
            }
            return true;
        });

module.exports.addValidation = [
    body('name', 'Name is required').notEmpty(),
    categoryIdValidation,
    body('imageId')
        .if(body('imageId').exists())
        .isMongoId().withMessage('Invalid image id'),
    validate
];

module.exports.updateValidation = [
    compilationIdValidation,
    body('name', 'Name is required').notEmpty(),
    categoryIdValidation,
    body('imageId')
        .if(body('imageId').exists())
        .isMongoId().withMessage('Invalid image id'),
    validate
];

module.exports.getAndDeleteValidation = [
    compilationIdValidation,
    validate
]
