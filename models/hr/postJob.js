const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    jobId: { type: Number, unique: true, required: true }, // Simplified, readable job ID
    hrId: { type: mongoose.Schema.Types.ObjectId, ref: 'HR', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String, required: true },
    designation: { type: String, required: true },
    jobDescription: { type: String, required: true },
    experienceRequired: { type: String, required: true },
    package: { type: String, required: true },
});

module.exports = mongoose.model('Job', jobSchema);