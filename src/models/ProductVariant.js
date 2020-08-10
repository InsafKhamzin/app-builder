const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductVariantSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        index: true
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
    characteristics: [{
        characteristic: {
            type: String,
            required: true
        },
        option: {
            type: String,
            required: true
        }
    }]

});


module.exports = ProductVariant = mongoose.model('product_variant', ProductVariantSchema);