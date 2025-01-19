const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicationId: {
    type: Number,
    unique: true,
    required: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', // Referencing Job model to get job details
    required: true,
  },
  numericJobId: {
    type: Number, // Store the numeric jobId for querying in the HR portal
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  resume: {
    type: String,
    required: true,
  },
  workExperience: {
    type: String,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-validate hook to generate applicationId
applicationSchema.pre('validate', async function (next) {
  if (!this.applicationId) {
    const lastApplication = await this.constructor.findOne().sort({ applicationId: -1 });
    this.applicationId = lastApplication ? lastApplication.applicationId + 1 : 101;
  }
  next();
});

// Populating the job details when fetching applications
applicationSchema.methods.populateJobDetails = function () {
  return this.populate('jobId', 'designation jobDescription experienceRequired package');
};

module.exports = mongoose.model('Application', applicationSchema);
