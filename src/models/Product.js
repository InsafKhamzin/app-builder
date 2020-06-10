const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    app: {
        type: Schema.Types.ObjectId,
        ref: 'app',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    totalQuantity:{
        type: Number,
        default: 0
    },
    totalOrders:{
        type: Number,
        default: 0
    },
    totalReviews:{
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0.0
    },
    price: {//DELETE
        type: Number,
        required: true
    },
    currency: {//DELETE
        type: String,
        required: true
    },
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'image'
    }],
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },
    attributes: [{
        type: String
    }],
    comments: [{
        commentType: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    }],
    tags: [{
        type: String
    }],
    characteristics: [{
        title: {
            type: String,
            required: true
        },
        values: [{
            title: {
                type: String,
                require: true,
            },
            value: {
                type: String,
                required: true
            }
        }]
    }],
    variants: [{
        type: Schema.Types.ObjectId,
        ref: 'product_variant'
    }]

});

module.exports = Product = mongoose.model('product', ProductSchema);