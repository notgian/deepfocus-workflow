const express = require('express');
const hbs = require('express-handlebars');
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require ('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const passport = require('passport')
dotenv.config()

const app = express()
const passportSetup = require('./config/passport-setup')

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

// Connect to MongoDB
const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.DB_DEV}?retryWrites=true&w=majority`;

mongoose.connect(mongoURI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB: ', err);
});

app.engine('hbs', hbs.engine({extname:'hbs'}));
app.set('view engine', 'hbs');
app.use(express.static('./public'));
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: null,
        httpOnly: true,
    }
}));

app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());

// Import routes
// I just copied this from a prev project, replace w/ the actual routes
// const importedRoute1 = require('./routes/routesFile1.js')
const { homeRouter } = require('./routes/home.js')
const { authRouter } = require('./routes/auth.js')
const { projectsRouter } = require('./routes/projects.js')

// construct the routes
app.use('/auth', authRouter);
app.use('/projects', projectsRouter);  // 
// app.use('/settings', mainRouter);  // This 
// app.use('/analytics', mainRouter);  // This 
// app.use('/calendar', mainRouter);  // This 
// app.use('/project/', mainRouter);
// app.use('/:projectid/brief', mainRouter);
// app.use('/:projectid/focus', mainRouter);
// app.use('/:projectid/notes', mainRouter);
app.use('/', homeRouter);

// Home page of the website, not the app
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

app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on port ${process.env.APP_PORT}`);
});

