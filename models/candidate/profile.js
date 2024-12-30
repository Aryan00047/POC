const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    candidate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User schema
      required: true,
      immutable: true, // Candidate ID should not change
    },
    name: {
      type: String,
      required: true,
      immutable: true, // Name should not be editable once set
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      immutable: true, // Email should not be editable once set
    },
    dob: {
      type: Date,
      required: true,
    },
    marks: {
      type: Number,
      required: true,
      min: 0, // Ensure marks are non-negative
      max: 100, // Example range for validation
    },
    university: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => value.length > 0,
        message: 'At least one skill is required.',
      },
    },
    resume: {
      type: String, // Store the file path of the uploaded resume
      required: false,
    },
    working: {
      type: Boolean,
      required: true,
    },
    company: {
      type: String,
      required: function () {
        return this.working; // Only required if the candidate is working
      },
    },
    designation: {
      type: String,
      required: function () {
        return this.working; // Only required if the candidate is working
      },
    },
    workExperience: {
      type: Number, // Store experience in years
      required: true,
      min: 0, // Ensure non-negative experience
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
  }
);

// Export the model
module.exports = mongoose.model('Profile', ProfileSchema);
