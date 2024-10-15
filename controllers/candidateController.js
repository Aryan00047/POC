const fs = require('fs').promises; // Use fs.promises for async/await
const path = require('path');
const Register = require('../models/candidate/register'); // Import Register model
const Profile = require('../models/candidate/profile'); // Import Profile model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateCandidate = require('../middleware/authmiddleware'); // Auth middleware

// Candidate registration handler
const registerCandidate = async (req, res) => {
    const { name, email, password } = req.body;
    console.log("Received password:", password); // Log the received password

    try {
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newCandidate = new Register({ name, email, password: hashedPassword });
        const savedCandidate = await newCandidate.save();

        res.status(201).json({
            message: 'Candidate registered successfully',
            candidate: savedCandidate
        });
    } catch (error) {
        console.error("Error during candidate registration:", error); // Log the full error
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

        // Return candidate data and token in the response
        res.status(200).json({
            message: 'Login successful',
            token,
            candidate: {
                id: candidate._id,
                name: candidate.name,
                email: candidate.email
            } // Including full candidate data
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

        // Check if the candidate exists
        const candidate = await Register.findById(Id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        // Find existing profile or create a new one
        const existingProfile = await Profile.findOne({ candidate_id: Id });

        // Construct the resume file path from the uploaded file
        let resumePath = req.file ? req.file.path : null;

        // Delete old resume if it exists
        if (existingProfile && existingProfile.resume && resumePath) {
            const oldResumePath = path.resolve(existingProfile.resume); // Absolute path
            try {
                await fs.access(oldResumePath); // Check if file exists
                await fs.unlink(oldResumePath); // Delete the old resume
                console.log('Old resume deleted:', oldResumePath);
            } catch (err) {
                console.log('Old resume does not exist, skipping deletion:', oldResumePath);
            }
        }

        // Rename the resume file with the candidate's email
        if (resumePath && candidate.email) {
            const fileExtension = path.extname(resumePath); // Get the file extension
            const newResumeName = `${candidate.email}${fileExtension}`; // Rename file to email + extension
            const newResumePath = path.join(path.dirname(resumePath), newResumeName); // New file path

            try {
                await fs.rename(resumePath, newResumePath); // Rename the file
                console.log('File renamed successfully to:', newResumePath);
                resumePath = newResumePath; // Update resume path after renaming
            } catch (err) {
                console.error('Error renaming file:', err);
                return res.status(500).json({ message: 'Error renaming file', error: err.message });
            }
        }

        // Update or create the profile
        const profile = await Profile.findOneAndUpdate(
            { candidate_id: Id },
            {
                dob,
                marks,
                university,
                skills,
                resume: resumePath, // Store the updated resume path
                company,
                role,
                workExperience,
                working,
                name: candidate.name, // Get name from candidate schema
                email: candidate.email // Get email from candidate schema
            },
            { upsert: true, new: true } // Create a new profile if it doesn't exist
        );

        return res.status(200).json({ message: 'Profile updated successfully', profile });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Export the functions
module.exports = {
    registerCandidate,
    loginCandidate,
    addProfile
};
