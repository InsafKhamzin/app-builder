const express = require('express');
const logger = require('./utils/logger');
const errorMiddleware = require('./api/middlewares/serverError');
const notFoundMiddleware = require('./api/middlewares/notFoundMiddleware');

const connectDb = require('./loaders/db');

const app = express();

//parse json
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
    res.send(`API is running. Mode: ${process.env.NODE_ENV}`)
});

const PORT = process.env.PORT || 3000;

//routes
app.use('/api/auth', require('./api/routes/auth'));
app.use('/api/app', require('./api/routes/app'));

app.use('/api/app/:appId/product', require('./api/routes/product'));
app.use('/api/app/:appId/category', require('./api/routes/category'));

app.use(errorMiddleware);
app.use(notFoundMiddleware);

//init db
connectDb()
    .then(() => {
        //start app
        app.listen(PORT, () => logger.info('Server is runnning on port ' + PORT));
    });
