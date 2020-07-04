const bcrypt = require('bcryptjs');
const _object = require('lodash/object');

const logger = require('../utils/logger');
const User = require('../models/User');
const App = require('../models/App');
const ClientError = require('../common/clientError');
const { createToken, createRefresh } = require('../utils/token');


module.exports = class AuthService {
    async registerUser({ email, password, firstName, lastName }) {
        try {
            let user = await User.findOne({ email });
            if (user) {
                throw new ClientError('User already exists', 400);
            }
            user = new User({
                email,
                password,
                firstName,
                lastName
            });
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(password, salt);

            const tokenPayload = {
                user: {
                    id: user._id
                },
                apps: []
            };
            const token = createToken(tokenPayload);
            const { refreshToken, createdAt, expiresAt } = createRefresh();
            user.refreshTokens.push({ refreshToken, createdAt, expiresAt });

            const newUser = await user.save();
            return {
                token,
                refreshToken,
                user: _object.pick(newUser, ['_id', 'email', 'firstName', 'lastName']),
            }
        } catch (error) {
            logger.error(`AuthService registerUser ex: ${error.message}`);
            throw error;
        }
    }

    async loginUser({ email, password }) {
        try {
            let user = await User.findOne({ email });
            if (!user) {
                throw new ClientError('Invalid credentials', 400);
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new ClientError('Invalid credentials', 400);
            }
            let apps = []
            apps = await App.find({ user: user._id }, '_id');

            const tokenPayload = {
                user: {
                    id: user._id
                },
                apps: [...apps]
            };
            const token = createToken(tokenPayload);
            const { refreshToken, createdAt, expiresAt } = createRefresh();

            user.refreshTokens.push({ refreshToken, createdAt, expiresAt });
            await user.save();
            return {
                token,
                refreshToken,
                user: _object.pick(user, ['_id', 'email', 'firstName', 'lastName']),
                apps
            };
        } catch (error) {
            logger.error(`AuthService loginUser ex: ${error.message}`);
            throw error;
        }
    }

    async refresh({ refreshToken, userId }) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new ClientError('User not found', 404);
            }

            let apps = []
            apps = await App.find({ user: user._id }, '_id');

            const refreshTokenDb = user.refreshTokens.find(t => t.refreshToken === refreshToken);
            if (!refreshTokenDb) {
                throw new ClientError('Token not found', 404);
            }

            if (refreshTokenDb.expiresAt < Date.now()) {
                throw new ClientError('Token expired', 401);
            }

            const tokenPayload = {
                user: {
                    id: user._id
                },
                apps: [...apps]
            };
            const token = createToken(tokenPayload);
            return { token };
        } catch (error) {
            logger.error(`AuthService refresh ex: ${error.message}`);
            throw error;
        }
    }

    async revokeToken({ refreshToken, userId }) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new ClientError('User not found', 404);
            }

            const refreshTokenIdx = user.refreshTokens.findIndex(t => t.refreshToken === refreshToken);
            if (refreshTokenIdx === -1) {
                throw new ClientError('Token not found', 404);
            }

            user.refreshTokens.splice(refreshTokenIdx, 1);
            await user.save();
        } catch (error) {
            logger.error(`AuthService refresh ex: ${error.message}`);
            throw error;
        }
    }

    async getUser(userId) {
        try {
            const user = await User.findById(userId, '_id email firstName lastName');
            return user;
        } catch (error) {
            logger.error(`AuthService getUser ex: ${error.message}`);
            throw error;
        }
    }

}

