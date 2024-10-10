const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  candidate_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Register', // Reference to the candidate model
    required: true,
  },
  name: {
    type: String,
    required: true,
    // immutable: true, // Make it immutable in Mongoose
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    // immutable: true, // Make it immutable in Mongoose
  },
  dob: {
    type: Date,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  resume: {
    type: String, // Store the file path of the uploaded resume
    required: false,
  },
  company: {
    type: String,
    required: function() { return this.working; }, // Only required if working
  },
  role: {
    type: String,
    required: function() { return this.working; }, // Only required if working
  },
  workExperience: {
    type: String,
    required: function() { return this.working; }, // Only required if working
  },
  working: {
    type: Boolean,
    required: true,
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt timestamps
});

// Export the model
module.exports = mongoose.model('Profile', ProfileSchema);
