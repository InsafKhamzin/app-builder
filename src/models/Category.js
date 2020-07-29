const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const autoPopulateChildren = function(next) {
    this.populate('children');
    next();
};

const CategorySchema = new Schema({
    app: {
        type: Schema.Types.ObjectId,
        ref: 'app',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'category'
    }],
    productCount:{
        type: Number,
        required: true,
        default: 0
    }
});

CategorySchema
    .pre('findOne', autoPopulateChildren)
    .pre('find', autoPopulateChildren)

module.exports = Category = mongoose.model('category', CategorySchema);