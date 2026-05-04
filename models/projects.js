const mongoose = require('mongoose');

/**
 * Each user can have a number of projects.
 * Each project has its own notes, and records
 * its own activity when using the focus timer.
 */
const Project = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    projectName: {
        type: String,
        required: true,
    },
    projectDesc: {
        type: String,
    }
}, { timestamps: true});

module.exports = mongoose.model('Project', Project);
