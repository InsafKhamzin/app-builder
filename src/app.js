const express = require('express');
const logger = require('./utils/logger');
const errorMiddleware = require('./api/middlewares/serverError');
const notFoundMiddleware = require('./api/middlewares/notFoundMiddleware');
const authMiddleware = require('./api/middlewares/auth');
const config = require('config');
const { appIdToUserValidation } = require('./api/validators/appValidator');


const connectDb = require('./loaders/db');

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

    app.use('/builder/image', require('./api/routes/builder/image'));
}
if (currentApp === 'CLIENT' || currentApp ==='DEV') {
    //CLIENT ROUTES
    app.use('/client/:appId/auth', require('./api/routes/client/auth'));
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
