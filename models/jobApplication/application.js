const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    resume: { type: String, required: true },
    appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('application', applicationSchema);
