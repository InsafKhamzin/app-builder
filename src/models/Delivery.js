const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
    app: {
        type: Schema.Types.ObjectId,
        ref: 'app',
        index: true,
        required: true
    },
    type: {
        type: String,
        enum: ['city','country'],
        required: true
    },
    name: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    freeDelivery:{
        type: Number
    }
});

module.exports = Delivery = mongoose.model('delivery', DeliverySchema)