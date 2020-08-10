const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const Customer = require('../models/Customer');
const App = require('../models/App');
const ClientError = require('../common/clientError');
const { createToken, createRefresh } = require('../utils/token');
const _object = require('lodash/object');


module.exports = class CustomerAuthService {
    async registerCustomer({ app, email, password, firstName, lastName }) {
        let customer = await Customer.findOne({ app, email });
        if (customer) {
            throw new ClientError('Customer already exists', 400);
        }
        customer = new Customer({
            email,
            password,
            app,
            firstName,
            lastName
        });
        const salt = await bcrypt.genSalt();
        customer.password = await bcrypt.hash(password, salt);

        const tokenPayload = {
            user: {
                id: customer.id
            }
        };
        const token = createToken(tokenPayload);
        const { refreshToken, createdAt, expiresAt } = createRefresh();
        customer.refreshTokens.push({ refreshToken, createdAt, expiresAt });
        await customer.save();

        return {
            token,
            refreshToken,
            customer: _object.pick(customer, ['_id', 'email', 'firstName', 'lastName'])
        };
    }

    async loginCustomer({ app, email, password }) {
        let customer = await Customer.findOne({ app, email });
        if (!customer) {
            throw new ClientError('Invalid credentials', 400);
        }
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            throw new ClientError('Invalid credentials', 400);
        }
        const tokenPayload = {
            user: {
                id: customer.id
            }
        };
        const token = createToken(tokenPayload);
        const { refreshToken, createdAt, expiresAt } = createRefresh();

        customer.refreshTokens.push({ refreshToken, createdAt, expiresAt });
        await customer.save();

        return {
            token,
            refreshToken,
            customer: _object.pick(customer, ['_id', 'email', 'firstName', 'lastName'])
        };
    }

    async refresh({ refreshToken, customerId }) {
        console.log(customerId)
        const customer = await Customer.findById(customerId);
        if (!customer) {
            throw new ClientError('Customer not found', 404);
        }

        const refreshTokenDb = customer.refreshTokens.find(t => t.refreshToken === refreshToken);
        if (!refreshTokenDb) {
            throw new ClientError('Token not found', 404);
        }

        if (refreshTokenDb.expiresAt < Date.now()) {
            throw new ClientError('Token expired', 401);
        }

        const tokenPayload = {
            user: {
                id: customer.id
            }
        };
        const token = createToken(tokenPayload);
        return ({ token });
    }

    async revokeToken({ refreshToken, customerId }) {
        const customer = await Customer.findById(customerId);
        if (!customer) {
            throw new ClientError('Customer not found', 404);
        }
        const refreshTokenIdx = customer.refreshTokens.findIndex(t => t.refreshToken === refreshToken);
        if (refreshTokenIdx !== -1) {
            customer.refreshTokens.splice(refreshTokenIdx, 1);
            await customer.save();
        }
    }
}

