const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PickupSchema = new Schema({
    app: {
        type: Schema.Types.ObjectId,
        ref: 'app',
        index: true,
        required: true
    },
    phone: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    longitude: {
        type: String
    },
    latitude: {
        type: String
    },
    workingHours: {
        index: false,
        monday: {
            type: String
        },
        tuesday: {
            type: String
        },
        wednesday: {
            type: String
        },
        thursday: {
            type: String
        },
        friday: {
            type: String
        },
        saturday: {
            type: String
        },
        sunday: {
            type: String
        }
    }
});

module.exports = Pickup = mongoose.model('pickup', PickupSchema)