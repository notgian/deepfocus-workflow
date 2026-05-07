const mongoose = require('mongoose');

/**
 * This is essentially to record a user's work activity
 * on a certain date. This can be used to further dynamically
 * the user battery to factor in work periods that are not
 * included in the calendar. 
 */
const BrainDump = new mongoose.Schema({
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
    date: {
        type: Date,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('BrainDump', BrainDump);
