const fs = require('fs').promises;
const path = require('path');
const Register = require('../models/candidate/register');
const Profile = require('../models/candidate/profile');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Job = require('../models/hr/postJob');

// Candidate registration handler
const registerCandidate = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newCandidate = new Register({ name, email, password: hashedPassword });
    const savedCandidate = await newCandidate.save();
    res.status(201).json({ message: 'Candidate registered successfully', candidate: savedCandidate });
  } catch (error) {
    console.error("Error during candidate registration:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Candidate login handler
const loginCandidate = async (req, res) => {
  const { email, password } = req.body;
  try {
    const candidate = await Register.findOne({ email });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    const match = await bcrypt.compare(password, candidate.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: candidate._id, email: candidate.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({
      message: 'Login successful',
      token,
      candidate: { id: candidate._id, name: candidate.name, email: candidate.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add or update candidate profile
const addProfile = async (req, res) => {
  try {
    const { dob, marks, university, skills, company, role, workExperience, working } = req.body;
    const Id = req.params.id; // Candidate ID from URL
    const candidate = await Register.findById(Id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    const existingProfile = await Profile.findOne({ candidate_id: Id });
    let resumePath = req.file ? req.file.path : null;

    // Delete old resume if it exists
    if (existingProfile && existingProfile.resume && resumePath) {
      const oldResumePath = path.resolve(existingProfile.resume);
      try {
        await fs.access(oldResumePath);
        await fs.unlink(oldResumePath);
      } catch (err) {
        console.log('Old resume does not exist, skipping deletion:', oldResumePath);
      }
    }

    // Rename the resume file with the candidate's email
    if (resumePath && candidate.email) {
      const fileExtension = path.extname(resumePath);
      const newResumeName = `${candidate.email}${fileExtension}`;
      const newResumePath = path.join(path.dirname(resumePath), newResumeName);
      try {
        await fs.rename(resumePath, newResumePath);
        resumePath = newResumePath;
      } catch (err) {
        return res.status(500).json({ message: 'Error renaming file', error: err.message });
      }
    }

    const profile = await Profile.findOneAndUpdate(
      { candidate_id: Id },
      {
        dob,
        marks,
        university,
        skills,
        resume: resumePath,
        company,
        role,
        workExperience,
        working,
        name: candidate.name,
        email: candidate.email
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get candidate profile
const getCandidateProfile = async (req, res) => {
  try {
    const loggedInCandidateId = req.candidate.id;
    const requestedCandidateId = req.params.id;

    if (String(loggedInCandidateId) !== String(requestedCandidateId)) {
      return res.status(403).json({ message: 'Access denied. You can only view your own profile.' });
    }

    const candidate = await Register.findById(requestedCandidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const profile = await Profile.findOne({ candidate_id: requestedCandidateId });
    const candidateDetails = {
      id: candidate._id,
      name: candidate.name,
      email: candidate.email,
      profile: profile || null
    };

    return res.status(200).json({ message: 'Candidate details fetched successfully', candidateDetails });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Fetch all jobs with HR details
const getAllJobs = async (req, res) => {
    try {
        // Populate hrId to get HR's name and email
        const jobs = await Job.find().populate('hrId', 'name email');

        res.status(200).json({
            message: 'Jobs fetched successfully',
            jobs: jobs
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
  registerCandidate,
  loginCandidate,
  addProfile,
  getCandidateProfile,
  getAllJobs
};
