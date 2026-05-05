const express = require('express');
const hbs = require('express-handlebars');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
// const http = require ('http');

const app = express()

/* load values from dotenv file
 * the following are the expected keys
 *
 * APP_PORT:        Port the Application will use
 * MONGO_USER:      Username to use for mongodb authentication
 * MONGO_PASS:      Password to use for mongodb authentication
 * MONGO_CLUSTER:   Name of the cluster to connect to
 * DB_PROD:         Prod database
 * DB_DEV:          Dev database
 *
 */
dotenv.config()

app.engine('hbs', hbs.engine({extname:'hbs'}));
app.set('view engine', 'hbs');
app.use(express.static('./public'));
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: null,
//         httpOnly: true,
//     }
// }));

app.use(express.json())


// Import routes
// I just copied this from a prev project, replace w/ the actual routes
// const importedRoute1 = require('./routes/routesFile1.js')

// construct the routes
const mainRouter = express.Router();
// mainRouter.use('/auth', mainRouter);
// mainRouter.use('/signup', mainRouter);
// mainRouter.use('/dash', mainRouter);
// mainRouter.use('/:projectid/', mainRouter);
// mainRouter.use('/:projectid/notes', mainRouter);
// mainRouter.use('/:projectid/focus', mainRouter);

// Home page of the website, not the app
app.use('/', mainRouter);
// If we want another section for about or not ig
// app.use('/about', mainRouter);

// 404 page. Currently returns a json object
app.use( ( req, res, next ) => {
    res.status( 404 ).send({
        status: 404,
        message: '404 page not found.',
        data: null
  });
});

app.listen(process.env.APP_PORT)

