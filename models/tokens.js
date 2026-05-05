const mongoose = require('mongoose');

const Tokens = new mongoose.Schema({
    // access token is stored by server or client 
    // rather than the database i.e. via 
    // local storage or session storage.
    refreshTok: {
        type: String,
        unique: true,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    expiresAfter: {
        type: Date,
    }
});

module.exports = mongoose.model('Tokens', Tokens);
