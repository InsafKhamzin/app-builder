const { decodeToken } = require('../../utils/token');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ errors: [{ msg: 'Access denied' }] });
    }
    const payload = decodeToken(token);
    if (payload) {
        req.user = payload.user;
        req.apps = payload.apps;
        next();
    } else {
        res.status(401).json({ errors: [{ msg: 'Invalid token' }] });
    }
}