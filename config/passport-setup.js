const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/users')
const Token = require('../models/tokens');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        // actual info from the google profile processed here
        console.log('Google strategy callback function executed');
        console.log(profile);

        let currentUser = await User.findOne({ googleId: profile.id });

        if (!currentUser) {
            // if not, create user in db
            currentUser = await new User({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                displayImage: profile.photos[0].value
            }).save();
        }

        const tokenUpdate = {
            userId: currentUser._id, 
            accessTok: accessToken, 
            expiresAt: new Date(Date.now() + 3600 * 1000) 
        };

        // Only update refresh token when not null/or is provided by google for some reason (e.g. first time login, prompt, additional scopes)
        if (refreshToken) {
            tokenUpdate.refreshTok = refreshToken;
        }

        await Token.findOneAndUpdate(
            { userId: currentUser._id },
            { $set: tokenUpdate }, 
            { upsert: true }
        );  

        done(null, currentUser);
    } catch (err) {
        console.error('Error in Google Strategy callback: ', err);
        done(err, null);
    }

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
