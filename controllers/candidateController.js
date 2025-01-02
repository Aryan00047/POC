const path = require('path');
const fs = require('fs').promises; // To use async/await with fs
const Profile = require('../models/candidate/profile'); // Assuming you have the Profile model imported
const User = require('../models/userSchema'); // Assuming you have the User model imported
const Application = require('../models/candidate/application'); // Assuming Application model
const Job = require('../models/hr/postJob'); // Assuming you have a Job model
const mongoose = require('mongoose')

// Function to handle the profile update or creation
const updateOrCreateProfile = async (req, res) => {
  const { dob, marks, university, skills, company, designation, workExperience, working } = req.body;
  const candidateId = req.user.userId; // Assuming you are using the token userId
  const resumePath = req.file ? req.file.path : null; // Get the path of the uploaded resume

  try {
    // Fetch candidate data from the database (user must exist and be a 'candidate')
    const candidate = await User.findById(candidateId);
    if (!candidate || candidate.role !== 'candidate') {
      return res.status(403).json({ message: 'Access denied. Not a candidate.' });
    }

    // Check if the profile already exists
    const existingProfile = await Profile.findOne({ candidate_id: candidateId });

    // Delete old resume if it exists and a new resume is uploaded
    if (existingProfile && existingProfile.resume && resumePath) {
      const oldResumePath = path.resolve(existingProfile.resume);
      try {
        await fs.access(oldResumePath); // Check if old file exists
        await fs.unlink(oldResumePath); // Delete old resume
      } catch (err) {
        console.log('Old resume does not exist, skipping deletion:', oldResumePath);
      }
    }

    // Rename the resume file with the candidate's email if resumePath exists
    let updatedResumePath = resumePath;
    if (resumePath && candidate.email) {
      const fileExtension = path.extname(resumePath); // Get the file extension
      const newResumeName = `${candidate.email}${fileExtension}`; // Create a new resume name based on email
      const newResumePath = path.join(__dirname, '../uploads', newResumeName); // Define new path

      try {
        await fs.rename(resumePath, newResumePath); // Rename the file
        updatedResumePath = newResumePath; // Update resume path to the new one
      } catch (err) {
        return res.status(500).json({ message: 'Error renaming file', error: err.message });
      }
    }

    const updateFields = {};

    // Only add fields that are defined in the request
    if (dob !== undefined) updateFields.dob = dob;
    if (marks !== undefined) updateFields.marks = marks;
    if (university !== undefined) updateFields.university = university;
    if (skills !== undefined) updateFields.skills = skills;
    if (company !== undefined) updateFields.company = company;
    if (designation !== undefined) updateFields.designation = designation;
    if (workExperience !== undefined) updateFields.workExperience = workExperience;
    if (working !== undefined) updateFields.working = working;
    
    // Always update these fields
    updateFields.name = candidate.name;
    updateFields.email = candidate.email;
    if (updatedResumePath) updateFields.resume = updatedResumePath;
    
    const profile = await Profile.findOneAndUpdate(
      { candidate_id: candidateId },
      { $set: updateFields },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    // Fetch the profile by candidate ID
    const profile = await Profile.findOne({ candidate_id: req.user.userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found.' });
    }

    res.status(200).json({
      message: 'Profile fetched successfully.',
      profile,
    });
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Fetch all available jobs for candidates
const fetchAvailableJobs = async (req, res) => {
  try {
      // Find all jobs that are currently available (you may want to add filters for availability)
      const jobs = await Job.find().sort({ jobId: 1 }); // Sorting by jobId to show them in order

      if (!jobs.length) {
          return res.status(404).json({ message: 'No jobs available at the moment.' });
      }

      res.status(200).json({
          message: 'Available jobs fetched successfully',
          jobs,
      });
  } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({
          message: 'Error fetching available jobs',
          error: error.message,
      });
  }
};

// Apply for a job

const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params; // Job ID from route params
    const candidateId = req.user.userId; // Candidate ID from JWT token
    const numericJobId = parseInt(jobId, 10);
    if (isNaN(numericJobId)) {
      return res.status(400).json({ error: 'Invalid jobId format. Must be a number.' });
    }
    
    const job = await Job.findOne({ jobId: numericJobId });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    const profile = await Profile.findOne({ candidate_id: candidateId });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found. Please update your profile before applying.' });
    }
    
    const newApplication = new Application({
      jobId: job._id,  // Reference to the ObjectId of Job
      numericJobId: job.jobId, // Store the numeric jobId
      candidateId,
      name: profile.name,
      email: profile.email,
      skills: profile.skills,
      resume: profile.resume,
      workExperience: profile.workExperience,
    });
    
    await newApplication.save();
    res.status(201).json({ message: 'Application submitted successfully', application: newApplication });
  } catch (error) {
    console.error('Error applying for job:', error.message);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const viewCandidateApplications = async (req, res) => {
  const candidateId = req.user.userId; // Candidate ID from the JWT token

  try {
    // Verify if the user is a candidate
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Access denied. Only candidates can view their applications.' });
    }

    // Check if candidateId is valid and convert to ObjectId
    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      return res.status(400).json({ message: 'Invalid candidate ID format.' });
    }

    // Convert candidateId to ObjectId
    const objectId = new mongoose.Types.ObjectId(candidateId);

    // Fetch all applications submitted by the candidate and populate job details
    const applications = await Application.find({ candidateId: objectId })
      .populate({
        path: 'jobId',  // Ensure we're populating jobId correctly
        select: 'designation company',  // Only select the relevant fields from Job
        match: { _id: { $exists: true } }  // Ensure the jobId is valid
      });

    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: 'No applications found.' });
    }

    res.status(200).json({
      message: 'Applications fetched successfully',
      applications,
    });
  } catch (error) {
    console.error('Error fetching candidate applications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = {
  updateOrCreateProfile,
  getProfile,
  fetchAvailableJobs,
  applyForJob,
  viewCandidateApplications
};
