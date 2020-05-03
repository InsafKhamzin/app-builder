const bcrypt = require('bcryptjs');

const logger = require('../utils/logger');
const Customer = require('../models/Customer');
const App = require('../models/App');
const ClientError = require('../common/clientError');
const { createToken, createRefresh } = require('../utils/token');


module.exports = class AuthService {
    async registercustomer({ email, password, app }) {
        try {
            let customer = await Customer.findOne({ email });
            if (customer) {
                throw new ClientError('Customer already exists', 400);
            }
            customer = new Customer({
                email,
                password,
                app
            });
            const salt = await bcrypt.genSalt();
            customer.password = await bcrypt.hash(password, salt);

            const tokenPayload = {
                customer: {
                    id: customer.id
                }
            };
            const token = createToken(tokenPayload);
            const { refreshToken, createdAt, expiresAt } = createRefresh();
            customer.refreshTokens.unshift({ refreshToken, createdAt, expiresAt });

            await customer.save();

            return { token, refreshToken }
        } catch (error) {
            logger.error(`AuthService registercustomer ex: ${error.message}`);
            throw error;
        }
    }

    async logincustomer({ email, password, app }) {
        try {
            let customer = await Customer.findOne({ email, app });
            if (!customer) {
                throw new ClientError('Invalid credentials', 400);
            }

            const isMatch = await bcrypt.compare(password, customer.password);
            if (!isMatch) {
                throw new ClientError('Invalid credentials', 400);
            }

            const tokenPayload = {
                customer: {
                    id: customer.id
                }
            };
            const token = createToken(tokenPayload);
            const { refreshToken, createdAt, expiresAt } = createRefresh();

            customer.refreshTokens.unshift({ refreshToken, createdAt, expiresAt });
            await customer.save();

            let apps = [];
            apps = await App.find({customer: customer._id}, '_id');

            return { token, refreshToken, apps };
        } catch (error) {
            logger.error(`AuthService logincustomer ex: ${error.message}`);
            throw error;
        }
    }

    async refresh({ refreshToken, customerId }) {
        try {
            const customer = await Customer.findById(customerId);
            if (!customer) {
                throw new ClientError('Customer not found', 404);
            }

            const refreshTokenDb = customer.refreshTokens.find(t => t.refreshToken === refreshToken);
            if(!refreshTokenDb){
                throw new ClientError('Token not found', 404);
            }

            if(refreshTokenDb.expiresAt < Date.now()){
                throw new ClientError('Token expired', 401);
            }

            const tokenPayload = {
                customer: {
                    id: customer.id
                }
            };
            const token = createToken(tokenPayload);
            return({token});
        } catch (error) {
            logger.error(`AuthService refresh ex: ${error.message}`);
            throw error;
        }
    }

    async revokeToken({ refreshToken, customerId }) {
        try {
            const customer = await Customer.findById(customerId);
            if (!customer) {
                throw new ClientError('Customer not found', 404);
            }

            const refreshTokenIdx = customer.refreshTokens.findIndex(t => t.refreshToken === refreshToken);
            if(refreshTokenIdx === -1){
                throw new ClientError('Token not found', 404);
            }

            customer.refreshTokens.splice(refreshTokenIdx, 1);
            await customer.save();
        } catch (error) {
            logger.error(`AuthService refresh ex: ${error.message}`);
            throw error;
        }
    }
}

