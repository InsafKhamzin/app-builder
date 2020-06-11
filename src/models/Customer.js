const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
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
    date: {
        type: Date,
        default: Date.now
    },
    app: {
        type: Schema.Types.ObjectId,
        ref: 'app'
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
            }
        }
    ]
},
    {
        timestamps: true
    }
);

module.exports = Customer = mongoose.model('customer', CustomerSchema);