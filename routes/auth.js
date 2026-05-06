const express = require('express');
const passport = require('passport');
const router = express.Router();

// auth login
router.get('/login', (req, res) => {
    // handle with passport 
    res.send('Login route');
});

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport 
    res.send('Logout route');
});

// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.readonly'],
    prompt: 'consent',
    accessType: 'offline'
}));

// callback route for google to redirect to
router.get('/google/callback', passport.authenticate('google'), (req, res) => {

    res.send('Google callback route');
});

// TODO: remove this
// temporary route to set the user session
router.get('/fakelogin', (req, res) => {
    req.session.user = {
        _id: "69fad1c5e9591cf51e1b0d5b",
        googleId: "109259785027979911517",
        displayName: "Gian Ortha",
        email: "gianlorenzoortha@gmail.com",
        displayImage: "https://lh3.googleusercontent.com/a/ACg8ocJlXzSv-o8z3iqY01wiD_eo9FbT1NLWJsW2t-G4j70oJxQNug=s96-c"
    }

    res.send(`Fake user login success! ${JSON.stringify(req.session.user)}`)
})

module.exports = {
    authRouter: router
}
