const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    app: {
        type: Schema.Types.ObjectId,
        ref: 'app',
        index: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    avatar: {
        type: String
    },
    phone: {
        type: String
    },
    refreshTokens: [
        {
            refreshToken: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                required: true
            },
            expiresAt: {
                type: Date,
                required: true
            },
            _id: false
        }
    ],
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'product',
    }]
},
    {
        timestamps: true
    }
);

module.exports = Customer = mongoose.model('customer', CustomerSchema);