const Register = require('../models/candidate/register'); // Import Register model
const Profile = require('../models/candidate/profile'); // Import Profile model

// Register a new candidate
// Register a new candidate
const registerCandidate = async (req, res) => {
  const { name, email, password } = req.body; // Include password

  try {
    const newCandidate = new Register({ name, email, password }); // Add password to the new candidate object
    const savedCandidate = await newCandidate.save();

    res.status(201).json({ message: 'Candidate registered successfully', candidate: savedCandidate });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Login a candidate
const loginCandidate = async (req, res) => {
  const { email } = req.body;

  try {
    const candidate = await Register.findOne({ email });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.status(200).json({ message: 'Login successful', candidate });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add or update candidate profile
const fs = require('fs'); // Import file system module to handle file operations
const path = require('path');

const addProfile = async (req, res) => {
  try {
    const { dob, marks, university, skills, company, role, workExperience, working } = req.body;
    const Id = req.params.id; // Assuming this is the candidate's ID from the URL

    // Check if the candidate exists
    const candidate = await Register.findById(Id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Find the candidate's existing profile
    const existingProfile = await Profile.findOne({ candidate_id: Id });

    // Construct the resume file path from the uploaded file
    const resumePath = req.file ? req.file.path : null;

    // If a profile already exists and has a resume, delete the old resume file
    if (existingProfile && existingProfile.resume && resumePath) {
      const oldResumePath = path.resolve(existingProfile.resume); // Convert to absolute path
      fs.unlink(oldResumePath, (err) => {
        if (err) {
          console.error('Error deleting old resume:', err);
        } else {
          console.log('Old resume deleted:', oldResumePath);
        }
      });
    }

    // Update or create the profile
    const profile = await Profile.findOneAndUpdate(
      { candidate_id: Id },
      {
        dob,
        marks,
        university,
        skills,
        resume: resumePath, // Add the new resume path
        company,
        role,
        workExperience,
        working,
        name: candidate.name, // Fetching name from the candidate schema
        email: candidate.email  // Fetching email from the candidate schema
      },
      { upsert: true, new: true } // Create a new profile if it doesn't exist
    );

    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get candidate profile
// const getCandidateProfile = async (req, res) => {
//   const Id = req.params.id;

//   try {
//     const profile = await Profile.findOne({ candidateId: Id });
//     if (!profile) {
//       return res.status(404).json({ message: 'Profile not found' });
//     }

//     res.status(200).json(profile);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

module.exports = {
  registerCandidate,
  loginCandidate,
  addProfile,
  // getCandidateProfile
};
