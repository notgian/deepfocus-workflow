const mongoose = require('mongoose');

/**
 * Each user can have a collection of notes.
 * Each user's notes are stored as subdocuments
 * in an array
 */
const Notes = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    notes: [{
        title: {
            type: String,
            default: 'New Note',
        },
        content: {
            type: String,
            default: '',
        },
    }]
});

module.exports = mongoose.model('Notes', Notes);
