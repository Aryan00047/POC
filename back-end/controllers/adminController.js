const User = require('../models/userSchema'); // User model
const Job = require('../models/hr/postJob'); // Job model
const Application = require('../models/candidate/application'); // Application model
const mongoose = require('mongoose')
const { selectEmailTemplate, rejectEmailTemplate } = require('../middleware/emailTemplates');
const transporter = require('../middleware/emailTransporter');

// View all employees 
const viewEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'hr' }); // Find all employees (candidates)
    if (!employees || employees.length === 0) {
      console.log("No employees found...")
      return res.status(404).json({ message: 'No employees found.' });
    }
    res.status(200).json({ message: 'Employees retrieved successfully.', employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error fetching employees.', error: error.message });
  }
};

const viewCandidates = async (req, res) => {
  try {
    const employees = await User.find({ role: 'hr' });
    if (!employees || employees.length === 0) {
      console.log("No candidates found...")
      return res.status(404).json({ message: 'No candidates found.' });
    }
    res.status(200).json({ message: 'candidates retrieved successfully.', employees });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Server error fetching candidates.', error: error.message });
  }
};

// View all applications
const viewApplications = async (req, res) => {
  try {
    const applications = await Application.find(); 
    if (!applications || applications.length === 0) {
      console.log("No applications found...")
      return res.status(404).json({ message: 'No applications found.' });
    }
    res.status(200).json({ message: 'Applications retrieved successfully.', applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error fetching applications.', error: error.message });
  }
};

// View HR details and jobs
const viewHrByEmail = async (req, res) => {
  try {
    const { email } = req.params; // Extract HR email from URL params
    const hr = await User.findOne({ email, role: 'hr' }); // Find HR by email
    if (!hr) {
      console.log("HR account not found...")
      return res.status(404).json({ message: 'HR account not found.' });
    }

    const jobs = await Job.find({ hrId: hr._id }); // Find jobs created by this HR
    console.log("HR account and jobs retrieved successfully...")
    res.status(200).json({ message: 'HR account and jobs retrieved successfully.', hr, jobs });
  } catch (error) {
    console.error('Error fetching HR account or jobs:', error);
    res.status(500).json({ message: 'Server error fetching HR account or jobs.', error: error.message });
  }
};

// Delete candidate account and associated applications
const deleteCandidateByEmail = async (req, res) => {
  try {
    const { email } = req.params; // Extract email from params

    console.log('Deleting candidate with email:', email);

    // Find and delete the candidate by email and role
    const candidate = await User.findOneAndDelete({ email, role: 'candidate' });

    if (!candidate) {
      console.log("Candidate not found...")
      return res.status(404).json({
        message: 'Candidate not found.',
        details: { email },
      });
    }

    // Delete associated applications
    await Application.deleteMany({ candidateId: candidate._id });

    console.log("Candidate account and associated applications deleted successfully.")
    res.status(200).json({
      message: 'Candidate account and associated applications deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting candidate account:', error);
    res.status(500).json({ message: 'Server error deleting candidate account.', error: error.message });
  }
};

// Delete HR account and associated jobs
const deleteHrByEmail = async (req, res) => {
  try {
    const { email } = req.params; // Extract HR email from URL params
    const hr = await User.findOneAndDelete({ email, role: 'hr' }); // Find and delete HR by email
    if (!hr) {
      console.log("HR account not found...")
      return res.status(404).json({ message: 'HR account not found.' });
    }

    await Job.deleteMany({ hrId: hr._id }); // Delete all jobs created by this HR
    console.log("HR account and associated jobs deleted successfully.")
    res.status(200).json({ message: 'HR account and associated jobs deleted successfully.' });
  } catch (error) {
    console.error('Error deleting HR account:', error);
    res.status(500).json({ message: 'Server error deleting HR account.', error: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { isSelected } = req.body;

  try {
    // Validate applicationId and isSelected value
    if (isNaN(applicationId)) {
      console.log('Invalid applicationId format. Must be a number.')
      return res.status(400).json({ message: 'Invalid applicationId format. Must be a number.' });
    }
    if (typeof isSelected !== 'boolean') {
      console.log("Invalid isSelected value. Must be true or false.")
      return res.status(400).json({ message: 'Invalid isSelected value. Must be "true" or "false".' });
    }

    // Find the application by applicationId
    const application = await Application.findOne({ applicationId });
    if (!application) {
      console.log("Application not found...")
      return res.status(404).json({ message: 'Application not found.' });
    }

    // Fetch job details using jobId
    const job = await Job.findById(application.jobId).select('company designation jobDescription package');
    if (!job) {
      console.log("Job details not found...")
      return res.status(404).json({ message: 'Job details not found.' });
    }

    // Fetch candidate details
    const candidate = await User.findById(application.candidateId).select('name email');

    // Update the application status
    application.isSelected = isSelected;
    await application.save();

    // Send email based on selection status
    const emailTemplate = isSelected
      ? selectEmailTemplate(candidate, job)
      : rejectEmailTemplate(candidate, job);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: candidate.email,
      subject: isSelected ? 'Congratulations! You are selected for the job' : 'Job Application Status',
      html: emailTemplate,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent to Candidate:", info.response);

    res.status(200).json({
      message: isSelected ? 'Candidate selected and email sent.' : 'Candidate rejected and email sent.',
      application,
    });

  } catch (error) {
    console.error('Error updating application status and sending email:', error);
    res.status(500).json({ message: 'Error updating application status', error: error.message });
  }
};

const createAdminAccount = async () => {
  try {
    // Check if an admin already exists
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL, role: 'admin' });
    if (existingAdmin) {
      console.log('Admin account already exists.');
      return;
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    // Create the admin user
    const newAdmin = new User({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
    });

    // Save the admin to the database
    await newAdmin.save();

    console.log('Admin account created successfully.');
  } catch (error) {
    console.error('Error creating admin account:', error.message);
  }
};

module.exports = {
  viewHrByEmail, 
  deleteHrByEmail,
  updateApplicationStatus,
  viewApplications,
  deleteCandidateByEmail,
  viewEmployees,
  createAdminAccount,
  viewCandidates
};