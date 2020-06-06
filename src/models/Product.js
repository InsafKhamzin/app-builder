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
    price: {
        type: Number,
        required: true
    },
    currency: {
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
    }

});

module.exports = Product = mongoose.model('product', ProductSchema);