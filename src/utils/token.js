const jwt = require('jsonwebtoken');
const config = require('config');
const { v4: uuidv4 } = require('uuid');

const createToken = (payload) => {
    const token = jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
            expiresIn: config.get('accessTokenExp')
        });
    return token;
}

const decodeToken = (token) => {
    try {
        const payload = jwt.verify(token, config.get('jwtSecret'));
        return payload;
    } catch (error) {
        return undefined;
    }
}

const createRefresh = () => {
    const refreshToken = uuidv4();
    const createdAt = Date.now();

    const refreshExpDays = parseInt(config.get('refreshTokenExp'));
    let expiresAt = new Date(createdAt);
    expiresAt.setDate(expiresAt.getDate() + refreshExpDays);

    return { refreshToken, createdAt, expiresAt };
}


module.exports = { createToken, decodeToken, createRefresh }