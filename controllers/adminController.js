const jwt = require('jsonwebtoken');
const Candidate = require('../models/candidate/register');
const CandidateProfile = require('../models/candidate/profile');
const Hr = require('../models/hr/register');
require('dotenv').config();

// Admin login
const loginAdmin = async (req, res) => {
    console.log("Login Admin requested ...");
    const { email, password } = req.body;

    try {
        // Fetch email and password from environment variables
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (email !== adminEmail) {
            console.log("Admin not found");
            return res.status(404).json({ message: 'Admin not found' });
        }

        if (password !== adminPassword) {
            console.log("Invalid credentials");
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If credentials match, generate a JWT token
        const token = jwt.sign({ email: adminEmail }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("Admin logged in successfully");
        res.status(200).json({ message: 'Login successful', token, admin: { email: adminEmail } });
        
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch all candidates
const fetchCandidates = async (req, res) => {
    console.log("Fetch candidates hit on Admin portal...");
    try {
        const candidates = await Candidate.find({}, 'name email');
        const candidatesWithProfiles = await Promise.all(candidates.map(async candidate => {
            const profile = await CandidateProfile.findOne({ candidate_id: candidate._id }, 'working skills');
            return {
                candidate: {
                    name: candidate.name,
                    email: candidate.email,
                },
                profile: profile ? { working: profile.working, skills: profile.skills } : null
            };
        }));

        res.status(200).json({ message: 'Candidates fetched successfully', candidates: candidatesWithProfiles });
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch all HR details
const fetchHr = async (req, res) => {
    console.log("Fetch HR details hit on admin portal...");
    try {
        const hrs = await Hr.find({}, 'name email');  // Fetch HR details from Hr collection
        res.status(200).json({ message: 'HRs fetched successfully', hrs });
    } catch (error) {
        console.error("Error fetching HR details:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { loginAdmin, fetchCandidates, fetchHr };
