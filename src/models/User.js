const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
    ]
},
    {
        timestamps: true
    }
);

module.exports = User = mongoose.model('user', UserSchema);