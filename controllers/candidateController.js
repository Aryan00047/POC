const path = require('path');
const fs = require('fs').promises; // To use async/await with fs
const Profile = require('../models/candidate/profile'); // Assuming you have the Profile model imported
const User = require('../models/userSchema'); // Assuming you have the User model imported

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

    // Update or create the profile with the new resume path
    const profile = await Profile.findOneAndUpdate(
      { candidate_id: candidateId }, // Search for existing profile by candidate_id
      {
        dob,
        marks,
        university,
        skills,
        resume: updatedResumePath, // Save the updated resume path
        company,
        designation,
        workExperience,
        working,
        name: candidate.name,
        email: candidate.email
      },
      { upsert: true, new: true } // If profile does not exist, create a new one
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

module.exports = {
  updateOrCreateProfile,
  getProfile
};
