const mongoose = require('mongoose');

/**
 * Each user can have a collection of notes per project.
 * Each user's notes are stored as a separate document.
 */
const Note = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project', 
        required: true
    },
    title: {
        type: String,
        default: 'New Note',
    },
    content: {
        type: String,
        default: '',
    }
});

module.exports = mongoose.model('Note', Note);
