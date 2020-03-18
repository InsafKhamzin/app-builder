const logger = require('../../services/logger');

module.exports = function (err, req, res, next) {
    logger.error(`${err.message}\n${err.stack}`);

    if (!err.statusCode) {
        err.statusCode = 500;
    }
    res.status(err.statusCode).json({ msg: 'Server Error' });
}