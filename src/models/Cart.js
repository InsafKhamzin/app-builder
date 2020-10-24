const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    customer: {
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
        quantity: {
            type: Number,
            required: true
        },
        _id: false
    }]
});

module.exports = Cart = mongoose.model('cart', CartSchema)