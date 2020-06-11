const { decodeToken } = require('../../utils/token');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ errors: [{ msg: 'Access denied' }] });
    }

    const { user, apps } = decodeToken(token);
    if (user) {
        req.user = user;
        req.apps = apps;
        next();
    } else {
        res.status(401).json({ errors: [{ msg: 'Invalid token' }] });
    }
}