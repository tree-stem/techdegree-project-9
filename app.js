'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const sequelize = require('./models').sequelize;
const routes = require('./routes');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// Express middleware
app.use(express.json());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// Add routes
app.use('/api', routes);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// Test the database connection.
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
