const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    app: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'app',
        index: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'customer',
        index: true
    },
    total: {
        type: Number,
        required: true
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
    }],
    pickup: {
        type: Schema.Types.ObjectId,
        ref: 'pickup',
    },
    delivery: {
        type: Schema.Types.ObjectId,
        ref: 'delivery',
    },
    deliveryInfo: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        country: {
            type: String
        },
        postalCode: {
            type: String,
            required: true
        },
        phone: {
            type: String
        },
        trackNumber: {
            type: String
        }
    },
    status: {
        type: String,
        required: true,
        enum: ['new', 'paid', 'transit', 'done', 'canceled'],
        default: 'new'
    }
},
    {
        timestamps: true
    });

module.exports = Order = mongoose.model('order', OrderSchema)