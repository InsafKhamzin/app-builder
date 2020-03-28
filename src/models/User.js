const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
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
    refreshTokens: [
        {
            refreshToken: {
                type: String,
                required: true
            },
            createdAt:{
                type: Date,
                required: true
            },
            expiresAt: {
                type: Date,
                required: true
            }
        }
    ]
}, { versionKey: false });

module.exports = User = mongoose.model('user', UserSchema);