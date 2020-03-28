const logger = require('../../utils/logger');

module.exports = function (err, req, res, next) {
    logger.error(`${err.message}\n${err.stack}`);

    if (err.httpStatus) {
        //client errors
        return res.status(err.httpStatus)
                .json({ errors: [{ msg: err.message }] });
    }
    res.status(500)
        .json({ errors: [{ msg: 'Server Error' }] });
}