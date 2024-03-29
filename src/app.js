const express = require('express');
const logger = require('./utils/logger');
const errorMiddleware = require('./api/middlewares/serverError');
const notFoundMiddleware = require('./api/middlewares/notFoundMiddleware');
const authMiddleware = require('./api/middlewares/auth');
const config = require('config');
const { appIdToUserValidation, appIdValidationDb } = require('./api/validators/appValidator');


const connectDb = require('./loaders/db');
require('express-async-errors');

const app = express();

app.use(require('express-status-monitor')())

//parse json
app.use(express.json({ extended: false }));

const currentApp = config.get('currentApp');

app.get('/', (req, res) => {
    res.send(`API is running. Mode: ${process.env.NODE_ENV} App: ${currentApp}`)
});

const PORT = process.env.PORT || 3000;

if (currentApp === 'BUILDER' || currentApp ==='DEV') {
    //BUILDER ROUTES
    app.use('/builder/auth', require('./api/routes/builder/auth'));
    app.use('/builder/app', require('./api/routes/builder/app'));

    app.use('/builder/app/:appId/product', authMiddleware);//controller scoped middlewares and validators
    app.use('/builder/app/:appId/product', appIdToUserValidation);
    app.use('/builder/app/:appId/product', require('./api/routes/builder/product'));

    app.use('/builder/app/:appId/category', authMiddleware);
    app.use('/builder/app/:appId/category', appIdToUserValidation);
    app.use('/builder/app/:appId/category', require('./api/routes/builder/category'));

    app.use('/builder/app/:appId/compilation', authMiddleware);
    app.use('/builder/app/:appId/compilation', appIdToUserValidation);
    app.use('/builder/app/:appId/compilation', require('./api/routes/builder/compilation'));

    app.use('/builder/app/:appId/delivery', authMiddleware);
    app.use('/builder/app/:appId/delivery', appIdToUserValidation);
    app.use('/builder/app/:appId/delivery', require('./api/routes/builder/delivery'));

    app.use('/builder/app/:appId/deployment', authMiddleware);
    app.use('/builder/app/:appId/deployment', appIdToUserValidation);
    app.use('/builder/app/:appId/deployment', require('./api/routes/builder/deployment'));

    app.use('/builder/image', require('./api/routes/builder/image'));
}

if (currentApp === 'CLIENT' || currentApp ==='DEV') {
    //CLIENT ROUTES
    app.use('/client/:appId', appIdValidationDb);

    app.use('/client/:appId/auth', require('./api/routes/client/auth'));
    app.use('/client/:appId/main', require('./api/routes/client/main'));
    app.use('/client/:appId/product', require('./api/routes/client/product'));
    app.use('/client/:appId/category', require('./api/routes/client/category'));
    app.use('/client/:appId/delivery', require('./api/routes/client/delivery'));

    app.use('/client/:appId/cart', authMiddleware);
    app.use('/client/:appId/cart', require('./api/routes/client/cart'));

    app.use('/client/:appId/order', authMiddleware);
    app.use('/client/:appId/order', require('./api/routes/client/order'));
}

//global middlewares
app.use(errorMiddleware);
app.use(notFoundMiddleware);

//init db
connectDb()
    .then(() => {
        //start app
        app.listen(PORT, () => logger.info('Server is runnning on port ' + PORT));
    });

process.on('uncaughtException', (err) => {
    logger.crit('There was an uncaught error', err)
    process.exit(1)
})
