const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('../config/app');
const { morganLogger, createRequestLogger } = require('./middleware/logging');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const indexRoutes = require('./routes/index');
const apiRoutes = require('./routes/api');

const app = express();

app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));

app.use(cors(config.cors));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(morganLogger);
app.use(createRequestLogger());

app.use('/', indexRoutes);
app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;