const bcrypt = require('bcryptjs');

const logger = require('../utils/logger');
const User = require('../models/User');
const ClientError = require('../common/clientError');
const { createToken, createRefresh } = require('../utils/token');


module.exports = class AuthService {
    async registerUser({ email, password }) {
        try {
            let user = await User.findOne({ email });
            if (user) {
                throw new ClientError('User already exists', 400);
            }
            user = new User({
                email,
                password
            });
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(password, salt);

            const tokenPayload = {
                user: {
                    id: user.id
                }
            };
            const token = createToken(tokenPayload);
            const { refreshToken, createdAt, expiresAt } = createRefresh();
            user.refreshTokens.unshift({ refreshToken, createdAt, expiresAt });

            await user.save();

            return { token, refreshToken }
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

            const tokenPayload = {
                user: {
                    id: user.id
                }
            };
            const token = createToken(tokenPayload);
            const { refreshToken, createdAt, expiresAt } = createRefresh();

            user.refreshTokens.unshift({ refreshToken, createdAt, expiresAt });
            await user.save();

            return { token, refreshToken };
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

            const refreshTokenDb = user.refreshTokens.find(t => t.refreshToken === refreshToken);
            if(!refreshTokenDb){
                throw new ClientError('Token not found', 404);
            }

            if(refreshTokenDb.expiresAt < Date.now()){
                throw new ClientError('Token expired', 401);
            }

            const tokenPayload = {
                user: {
                    id: user.id
                }
            };
            const token = createToken(tokenPayload);
            return({token});
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
            if(refreshTokenIdx === -1){
                throw new ClientError('Token not found', 404);
            }

            user.refreshTokens.splice(refreshTokenIdx, 1);
            await user.save();
        } catch (error) {
            logger.error(`AuthService refresh ex: ${error.message}`);
            throw error;
        }
    }
}

