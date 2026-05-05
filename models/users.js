const mongoose = require('mongoose');

/*
 * Each user would likely have an email
 * and password. Other info and integrations
 * can be determined later on.
 */
const User = new mongoose.Schema({
    // different from the internal id
    googleId: {
        type: String,
        unique: true,
    },
    // obtain the fields below from the google
    // account if we can.
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    }
});

module.exports = mongoose.model('User', User);
