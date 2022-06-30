const express = require('express');
const app = express();
require('express-async-errors');
const cors = require('cors');
const logger = require('./utils/logger');
const {unknownEndpoint, errorHandler} = require('./utils/middleware');
const config = require('./utils/config');
const mongoose = require('mongoose');
const blogRouter = require('./controllers/blog');



logger.info('connecting to', config.MONGODB_URI);

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl)
    .then(() => {
        logger.info('connected to MongoDB');
    })
    .catch(error => {
        logger.error('error connection to MongoDB:', error.message);
        process.exit();
    })

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;