const logger = require('../../services/logger');

module.exports = function (err, req, res, next) {
    logger.error(`${err.message}\n${err.stack}`);

    if (err.httpStatus) {
        //client errors
        return res.status(err.httpStatus).json({ msg: err.message });
    }
    res.status(500).json({ msg: 'Server Error' });
}