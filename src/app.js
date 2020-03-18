const express = require('express');
const logger = require('./services/logger');
const errorMiddleware = require('./api/middlewares/serverError');

const connectDb = require('./loaders/db');

const app = express();

//parse json
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
    res.send('API is running')
});

const PORT = process.env.PORT || 3000;

//routes
app.use('/api/auth', require('./api/routes/auth'));
app.use('/api/app', require('./api/routes/app'));

app.use(errorMiddleware);


//init db
connectDb()
    .then(() => {
        //start app
        app.listen(PORT, () => logger.info('Server is runnning on port ' + PORT));
    });
