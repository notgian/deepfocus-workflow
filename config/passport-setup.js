const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/users')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    // actual info from the google profile processed here
    console.log('Google strategy callback function executed');
    console.log(profile);

    User.findOne({ 'google.id': profile.id }).then((currentUser) => {
        if (currentUser) {
            // already have the user
            console.log('User already exists: ', currentUser);

            currentUser.google.token = accessToken;
            currentUser.save().then((updatedUser) => {
                done(null, updatedUser);
            });
        } else {
            // if not, create user in db
            new User({
                email: profile.emails[0].value,
                displayName: profile.displayName,
                google: {
                    id: profile.id,
                    token: accessToken
                }
            }).save().then((newUser) => {
                console.log('New user created: ', newUser);
                done(null, newUser);
            }).catch((err) => {
                console.error('Error creating user: ', err);
                done(err, null);
            });
        }
    });

}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    }).catch((err) => {
        done(err, null);
    });
});
