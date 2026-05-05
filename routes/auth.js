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
    scope: ['profile', 'email']
}));

// callback route for google to redirect to
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    
    res.send('Google callback route');
});

module.exports = {
    authRouter: router
}
