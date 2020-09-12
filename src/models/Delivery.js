const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
    app: {
        type: Schema.Types.ObjectId,
        ref: 'app',
        index: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    period: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    freeFrom: {
        type: Number
    }
});

module.exports = Delivery = mongoose.model('delivery', DeliverySchema)