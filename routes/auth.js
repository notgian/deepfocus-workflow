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
        _id: "69fae70ace9b1088792dca27",
        googleId: "101370151437162306820",
        displayName: "Kennese Ross Manalang",
        email: "kennese_manalang@dlsu.edu.ph",
        displayImage: "https://lh3.googleusercontent.com/a/ACg8ocL0FurayyARxtEXgUUjtnpW-ItfO0tMzF3QcITzXqCy-EvCN0aK=s96-c"
    }

    res.send(`Fake user login success! ${JSON.stringify(req.session.user)}`)
})

module.exports = {
    authRouter: router
}
