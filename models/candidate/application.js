const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',  // Reference to the candidate model
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',  // Reference to the job model
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    candidateProfile: {
        type: Object,  // Store candidate profile details as an object
        required: true
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Application', applicationSchema);
