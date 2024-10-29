const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',  // Reference to the candidate model
        required: true
    },
    jobId: {
        type: Number,// need to do this because mongoose expects object id othwerwise
        ref: 'Job',  // Reference to the job model
        required: true
    },
    name: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true  
    },
    skills: {
        type: [String], 
        required: true
    },
    resume: {
        type: String,  // Path or URL to resume file
        required: true
    },
    workExperience: {
        type: String,  
        required: true
    },
    appliedAt: {
        type: Date,
        default: Date.now  
    }
});

module.exports = mongoose.model('Application', applicationSchema);
