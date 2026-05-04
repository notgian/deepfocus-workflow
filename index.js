const express = require('express');
const http = require ('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv')

/* load values from dotenv file
 * the following are the expected keys
 *
 * APP_PORT:    Port the Application will use
 * MONGO_USER:  Username to use for mongodb authentication
 * MONGO_PASS:  Password to use for mongodb authentication
 * DB_PROD:     Prod database
 * DB_DEV:      Dev database
 *
 */
dotenv.config()

// Import routes
// I just copied this from a prev project, replace w/ the actual routes
// const importedRoute1 = require('./routes/routesFile1.js')

// Routing for all API v1 stuff
const mainRouter = express.Router();
// I just copied this from a prev project, replace w/ the actual routes
// mainRouter.use('/route1', importedRoute1);
mainRouter.use('/auth/')
app.use('/', mainRouter);

app.use(express.json())

// 404 
app.use( ( req, res, next ) => {
    res.status( 404 ).send({
        status: 404,
        message: '404 page not found.',
        data: null
  });
});

app.listen(port)

