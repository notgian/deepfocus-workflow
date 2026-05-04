const mongoose = require('mongoose');

/*
 * Each user would likely have an email
 * and password. Other info and integrations
 * can be determined later on.
 */
const User = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },

    // Local Auth Fields
    // For when account is created w/o Google
    local: {
        password: {
            type: String,
            select: false
        },
    },

    // Google Auth Fields
    // no need for password
    google: {
        id: {
            type: String,
            unique: true,
            sparse: true
        },
        token: String 
    }
});

module.exports = mongoose.model('User', User);
