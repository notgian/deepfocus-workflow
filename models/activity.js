const mongoose = require('mongoose');

/**
 * This is essentially to record a user's work activity
 * on a certain date. This can be used to further dynamically
 * the user battery to factor in work periods that are not
 * included in the calendar. 
 */
const Activity = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    // record actual start and end times separately
    // from the focus period's length, in case the
    // timer is paused
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project', 
        required: true
    },
    length: {
        type: Number,
        required: true,
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Activity', Activity);
