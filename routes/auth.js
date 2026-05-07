const express = require('express');
const passport = require('passport');
const router = express.Router();

// auth logout
router.get('/logout', (req, res, next) => {

    req.logout((err) => {
        if (err) { 
            return next(err); 
        }

        req.session.destroy((err) => {
            if (err) {
                return next(err); 
            }

            res.clearCookie('connect.sid'); 
            res.redirect('/');
        });
    });
});

// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.readonly'],
    prompt: 'consent',
    accessType: 'offline'
}));

// callback route for google to redirect to
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    // res.send('Google callback route');
    res.redirect('/projects')
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

    // res.send(`Fake user login success! ${JSON.stringify(req.session.user)}`);
    res.redirect('/projects');
})

module.exports = {
    authRouter: router
}
