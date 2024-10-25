const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const HR = require('../models/hr/register');
const Job = require('../models/hr/postJob');
const Candidate = require('../models/candidate/register');
const CandidateProfile = require('../models/candidate/profile');
const path = require('path');
const fs = require('fs').promises; // Use the promises API

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
        const token = jwt.sign({ id: hr._id, name: hr.name, email: hr.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
        // Fetch the latest jobId to generate the next jobId
        const latestJob = await Job.findOne().sort({ jobId: -1 }).exec();
        
        // Ensure nextJobId is a number and handle the case where there are no jobs yet
        const nextJobId = latestJob && latestJob.jobId ? latestJob.jobId + 1 : 1;

        const newJob = new Job({
            jobId: nextJobId, // Use the simplified, readable job ID
            hrId,
            name: req.hr.name,
            email: req.hr.email,
            company,
            role,
            jobDescription,
            experienceRequired,
            package,
        });

        const savedJob = await newJob.save();
        res.status(201).json({ message: 'Job posted successfully', job: savedJob });
    } catch (error) {
        console.error("Error posting job:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



// Fetch all candidates with name, email, working, and skills
const fetchCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find({}, 'name email');
        const candidatesWithProfiles = await Promise.all(candidates.map(async candidate => {
            const profile = await CandidateProfile.findOne({ candidate_id: candidate._id }, 'working skills');
            return { 
                candidate: {
                    name: candidate.name,
                    email: candidate.email,
                },
                profile: profile ? {
                    working: profile.working,
                    skills: profile.skills
                } : null
            };
        }));
        res.status(200).json({ 
            message: 'Candidates fetched successfully', 
            candidates: candidatesWithProfiles 
        });
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Fetch full candidate profile by email
const fetchCandidateProfile = async (req, res) => {
    try {
        const { email } = req.params;

        // Find the profile using email (case-insensitive)
        const profile = await CandidateProfile.findOne({ email: new RegExp(`^${email}$`, 'i') });

        if (!CandidateProfile) {
            return res.status(404).json({ message: 'Candidate profile not found' });
        }

        // Send full profile information in the response
        res.status(200).json({
            message: 'Candidate profile fetched successfully',
            profile: {
                name: profile.name,
                email: profile.email,
                dob: profile.dob,
                marks: profile.marks,
                university: profile.university,
                skills: profile.skills,
                working: profile.working,
                company: profile.company,
                role: profile.role,
                workExperience: profile.workExperience,
                resume: profile.resume
            }
        });
    } catch (error) {
        console.error("Error fetching candidate profile:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// HR downloads candidate resume
const downloadResumeHR = async (req, res) => {
    try {
        const candidateEmail = req.params.email;

        // Fetch the candidate by email
        const candidate = await Candidate.findOne({ email: candidateEmail });
        if (!candidate) {
            console.log(`Candidate not found with email: ${candidateEmail}`);
            return res.status(404).json({ message: "Candidate not found." });
        }

        // Fetch the candidate's profile
        const profile = await CandidateProfile.findOne({ candidate_id: candidate._id });
        if (!profile || !profile.resume) {
            console.log(`Resume not found for candidate with email: ${candidateEmail}`);
            return res.status(404).json({ message: "Resume not found for this candidate." });
        }

        // Define the full path to the resume
        const resumePath = path.join(__dirname, '../', profile.resume);

        // Check if the file exists
        await fs.access(resumePath); // This will throw if the file does not exist

        // Send the resume file for download
        res.download(resumePath, (err) => {
            if (err) {
                console.error("Error in downloading resume: ", err);
                return res.status(500).json({ message: "Error downloading the resume." });
            }
        });
    } catch (error) {
        console.error("Error fetching candidate or downloading resume: ", error);
        res.status(500).json({ message: "Server error." });
    }
};

module.exports = { registerHR, loginHR, postJob, fetchCandidates, fetchCandidateProfile, downloadResumeHR };