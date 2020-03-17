const mongoose = require('mongoose');
const config = require('config');
const logger = require('../services/logger');

const db = config.get('mongoURI')

const connectDb = async () => {
    try {
        await mongoose.connect(db,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            });

        logger.info('Db connected...');
    } catch (err) {
        logger.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDb;