const fs = require('fs');
const path = require('path');
const Register = require('../models/candidate/register'); // Import Register model
const Profile = require('../models/candidate/profile'); // Import Profile model

// Register a new candidate
const registerCandidate = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const newCandidate = new Register({ name, email, password });
    const savedCandidate = await newCandidate.save();

    res.status(201).json({ message: 'Candidate registered successfully', candidate: savedCandidate });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login a candidate
const loginCandidate = async (req, res) => {
  const { email, password } = req.body;

  try {
    const candidate = await Register.findOne({ email });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Here you can also check the password against the saved hash
    if (password !== candidate.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', candidate });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add or update candidate profile
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
    const existingProfile = await Profile.findOne({ candidate_id: Id }); // Changed candidateId to candidate_id

    // Construct the resume file path from the uploaded file
    let resumePath = req.file ? req.file.path : null;

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

    // Rename the resume file with the candidate's email
    if (resumePath && candidate.email) {
      const fileExtension = path.extname(resumePath); // Get the file extension (e.g., .pdf, .docx)
      const newResumeName = `${candidate.email}${fileExtension}`; // Rename file to email + extension
      const newResumePath = path.join(path.dirname(resumePath), newResumeName); // Get new file path

      console.log('Old resume path:', resumePath);
      console.log('New resume path:', newResumePath);

      // Rename the file
      fs.rename(resumePath, newResumePath, (err) => {
        if (err) {
          console.error('Error renaming file:', err); // Detailed error logging
          return res.status(500).json({ message: 'Error renaming file', error: err.message }); // Return on error
        }
        console.log('File renamed successfully to:', newResumePath);
        resumePath = newResumePath; // Update the resume path to the new renamed file
      });
    }

    // Update or create the profile
    const profile = await Profile.findOneAndUpdate(
      { candidate_id: Id }, // Changed candidateId to candidate_id
      {
        dob,
        marks,
        university,
        skills,
        resume: resumePath, // Save the renamed resume path
        company,
        role,
        workExperience,
        working,
        name: candidate.name, // Fetching name from the candidate schema
        email: candidate.email  // Fetching email from the candidate schema
      },
      { upsert: true, new: true } // Create a new profile if it doesn't exist
    );

    return res.status(200).json({ message: 'Profile updated successfully', profile }); // Return response after update
  } catch (error) {
    return res.status(500).json({ message: error.message }); // Return error if caught
  }
};

// Get candidate profile (if needed in the future)
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
  // getCandidateProfile (Uncomment when needed)
};
