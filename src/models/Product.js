const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    app: {
        type: Schema.Types.ObjectId,
        ref: 'app',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        index: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    totalQuantity: {
        type: Number,
        default: 0
    },
    totalOrders: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0.0
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    mainImage: {
        type: Schema.Types.ObjectId,
        ref: 'image'
    },
    images: [{
        type: Schema.Types.ObjectId,
        ref: 'image'
    }],
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
        name: {
            type: String,
            required: true
        },
        options: [{
            name: {
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
},
    {
        timestamps: true
    }
);

module.exports = Product = mongoose.model('product', ProductSchema);