const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductVariantSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'product'
    },
    quantity: {
        type: Number,
        required: true
    },
    fullPrice: {
        type: Number,
        required: true
    },
    purchasePrice: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    characteristics: [{
        type: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    }]

});


module.exports = ProductVariant = mongoose.model('product_variant', ProductVariantSchema);