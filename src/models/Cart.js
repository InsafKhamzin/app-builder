const mongoose = require('mongoose');
const { Neptune } = require('aws-sdk');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    _id: false,
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'customer',
        index: true
    },
    items: [{
        productVariant: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'product_variant'
        },
        count: {
            type: Number,
            required: true
        }
    }]
},
    {
        timestamps: true
    });

module.exports = Cart = mongoose.model('cart', CartSchema)