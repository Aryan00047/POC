const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const HR = require('../models/hr/register');
const Job = require('../models/hr/postJob');
const Candidate = require('../models/candidate/register');
const CandidateProfile = require('../models/candidate/profile');
const path = require('path');
const fs = require('fs');

// HR Registration
const registerHR = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newHR = new HR({ name, email, password: hashedPassword });
        const savedHR = await newHR.save();
        res.status(201).json({ message: 'HR registered successfully', hr: savedHR });
    } catch (error) {
        console.error("Error during HR registration:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// HR Login
const loginHR = async (req, res) => {
    const { email, password } = req.body;
    try {
        const hr = await HR.findOne({ email });
        if (!hr) {
            return res.status(404).json({ message: 'HR not found' });
        }

        const match = await bcrypt.compare(password, hr.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: hr._id, name: hr.name, email: hr.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token, hr: { id: hr._id, name: hr.name, email: hr.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Post Job
const postJob = async (req, res) => {
    const { hrId } = req.params;
    const { company, role, jobDescription, experienceRequired, package } = req.body;
    const hrTokenId = req.hr.id;

    if (hrId !== hrTokenId) {
        return res.status(403).json({ message: 'Access denied. You can only post jobs for your account.' });
    }

    try {
        const newJob = new Job({
            hrId,
            name: req.hr.name,
            email: req.hr.email,
            company,
            role,
            jobDescription,
            experienceRequired,
            package
        });

        const savedJob = await newJob.save();
        res.status(201).json({ message: 'Job posted successfully', job: savedJob });
    } catch (error) {
        console.error("Error posting job:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch all candidates with specific fields from both Candidate and Profile schemas
const fetchCandidates = async (req, res) => {
  try {
      // Fetch all candidates from the 'Candidate' collection
      const candidates = await Candidate.find({}, 'name email'); // Only get name and email from the 'Candidate' schema

      // Map over the candidates and fetch their profiles
      const candidatesWithProfiles = await Promise.all(candidates.map(async candidate => {
          const profile = await CandidateProfile.findOne({ candidate_id: candidate._id }, 'skills working workExperience'); // Fetch relevant fields from the profile

          // Format the result to include profile information
          return {
              name: candidate.name,
              email: candidate.email,
              skills: profile ? profile.skills : [], // Default to an empty array if no profile is found
              isWorking: profile ? profile.working : false, // Default to false if no profile is found
              workExperience: profile && profile.working ? profile.workExperience : null // Include workExperience only if isWorking is true
          };
      }));

      res.status(200).json({ message: 'Candidates fetched successfully', candidates: candidatesWithProfiles });
  } catch (error) {
      console.error("Error fetching candidates:", error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Fetch a single candidate's profile by either email or ObjectId
const fetchCandidateProfile = async (req, res) => {
  const { id, email } = req.params;  // `id` will be present for ID routes, `email` for email routes
  try {
      let candidate;

      // Check if the route is using `id` (ObjectId) or `email`
      if (id) {
          // Check if 'id' is a valid ObjectId or fallback to searching by email
          if (id.match(/^[0-9a-fA-F]{24}$/)) {
              candidate = await Candidate.findById(id);  // Query by ObjectId
          } else {
              return res.status(400).json({ message: 'Invalid ID format' });
          }
      } else if (email) {
          candidate = await Candidate.findOne({ email });  // Query by email
      }

      if (!candidate) {
          return res.status(404).json({ message: 'Candidate not found' });
      }

      const profile = await CandidateProfile.findOne({ candidate_id: candidate._id });
      if (!profile) {
          return res.status(404).json({ message: 'Profile not found for this candidate.' });
      }

      res.status(200).json({ message: 'Candidate profile fetched successfully', profile });
  } catch (error) {
      console.error("Error fetching candidate profile:", error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Download Candidate's Resume by Email
const downloadResume = async (req, res) => {
  const { email } = req.params;

    try {
        // Find the candidate using the email
        const candidate = await Candidate.findOne({ email });

        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found.' });
        }

        // Fetch the candidate's profile using the candidate's ID
        const profile = await CandidateProfile.findOne({ candidate_id: candidate._id });

        if (!profile || !profile.resume) {
            return res.status(404).json({ message: 'Resume not found for this candidate.' });
        }

        // Get the current resume path in the 'uploads' directory
        const resumePath = path.join(__dirname, '..', profile.resume);

        // Ensure the resume file exists
        if (!fs.existsSync(resumePath)) {
            return res.status(404).json({ message: 'Resume file not found on the server.' });
        }

        // Define the new path in the 'downloads' directory
        const downloadsDir = path.join(__dirname, '..', 'downloads');
        if (!fs.existsSync(downloadsDir)) {
            fs.mkdirSync(downloadsDir); // Create the downloads directory if it doesn't exist
        }

        const resumeFileName = path.basename(profile.resume); // Get the resume file name
        const destinationPath = path.join(downloadsDir, resumeFileName);

        // Copy the resume file from 'uploads' to 'downloads' directory
        fs.copyFileSync(resumePath, destinationPath);

        // Send response indicating that the resume is saved in the downloads directory
        res.status(200).json({ 
            message: 'Resume downloaded and stored in the downloads directory successfully', 
            downloadPath: destinationPath 
        });

    } catch (error) {
        console.error("Error fetching or saving resume:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
  registerHR,
  loginHR,
  postJob,
  fetchCandidates,
  fetchCandidateProfile,
  downloadResume
};
