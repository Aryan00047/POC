const mongoose = require('mongoose');

const loginTrackerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  loginTime: { type: Date, default: Date.now }, // Timestamp of login
  ipAddress: { type: String }, // IP address of the login request
  userAgent: { type: String }, // Device or browser information
  userRole: {type: String},
  userEmail : {type: String}
}, { timestamps: true });

const LoginTracker = mongoose.model('LoginTracker', loginTrackerSchema);

module.exports = LoginTracker;
