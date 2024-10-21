const fs = require('fs').promises;
const path = require('path');
const Register = require('../models/candidate/register');
const Profile = require('../models/candidate/profile');
const Application = require('../models/candidate/application')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Job = require('../models/hr/postJob');
const HR = require('../models/hr/register');  // HR model

// Candidate registration handler
const registerCandidate = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }
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
        const token = jwt.sign({ id: candidate._id, email: candidate.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, candidate: { id: candidate._id, name: candidate.name, email: candidate.email } });
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
            { dob, marks, university, skills, resume: resumePath, company, role, workExperience, working, name: candidate.name, email: candidate.email },
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
        const jobs = await Job.find().populate('hrId', 'name email');
        res.status(200).json({ message: 'Jobs fetched successfully', jobs });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Candidate applies for a job
const applyForJob = async (req, res) => {
    const { jobId, candidateId, resume } = req.body;

    try {
        // Step 1: Check if the job exists
        const job = await Job.findById(jobId).populate('hrId');  // Fetch the job along with HR details
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Step 2: Save the job application
        const newApplication = new Application({
            candidateId,
            jobId,
            resume
        });
        await newApplication.save();

        // Step 3: Get HR details from the populated 'hrId'
        const hrEmail = job.hrId.email;

        // Step 4: Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',  // You can change this to your email provider (or use SMTP)
            auth: {
                user: process.env.SMTP_USER,  // Your email
                pass: process.env.SMTP_PASS   // Your password or app-specific password
            }
        });

        // Step 5: Define the email options
        const mailOptions = {
            from: process.env.SMTP_USER,  // Sender's email address
            to: hrEmail,                  // HR's email address
            subject: 'New Job Application Received',
            text: `A candidate has applied for the job "${job.role}". Candidate ID: ${candidateId}.`,
            attachments: [
                {
                    filename: 'resume.pdf',  // Name of the file attached
                    path: resume  // Resume file path (ensure resume is stored in a proper location)
                }
            ]
        };

        // Step 6: Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Failed to send email to HR', error: error.message });
            } else {
                console.log('Email sent:', info.response);
                res.status(200).json({ message: 'Application submitted and HR notified successfully' });
            }
        });
    } catch (error) {
        console.error("Error applying for job:", error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { 
    registerCandidate,
     loginCandidate,
     addProfile,
     getCandidateProfile,
     getAllJobs,
     applyForJob
     };
