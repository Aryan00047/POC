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
    name: {
        type: String,
        required: true  // Candidate's name is required
    },
    email: {
        type: String,
        required: true  // Candidate's email is required
    },
    skills: {
        type: [String],  // Array of skills
        required: true
    },
    resume: {
        type: String,  // Path or URL to resume file
        required: true
    },
    workExperience: {
        type: String,  // Candidate's work experience
        required: true
    },
    appliedAt: {
        type: Date,
        default: Date.now  // Auto-set the date when the application is created
    }
});

module.exports = mongoose.model('Application', applicationSchema);
