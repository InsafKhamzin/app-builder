const logger = require('../../utils/logger');

module.exports = function (err, req, res, next) {

    if (err.httpStatus) {
        //client errors        
        logger.warn(`\nmsg:${err.message}\nuser:${JSON.stringify(req.user)}`);
        
        return res.status(err.httpStatus)
                .json({ errors: [{ msg: err.message }] });
    }
    
    logger.error(`${err.message}\n${err.stack}`);
    res.status(500)
        .json({ errors: [{ msg: 'Server Error' }] });
}