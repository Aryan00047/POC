const fs = require('fs').promises;
const path = require('path');
const Register = require('../models/candidate/register');
const Profile = require('../models/candidate/profile');
const Application = require('../models/candidate/application');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Job = require('../models/hr/postJob');
const nodemailer = require('nodemailer');
const HR =  require('../models/hr/register')
const mongoose = require('mongoose');

// Candidate registration handler
const registerCandidate = async (req, res) => {
    console.log("Register candidate hit ...");
    const { name, email, password } = req.body;
    try {
        if (!password || !email || !name) {
            return res.status(400).json({ message: 'All details are required..' });
        }else{
            console.log("All details entered");
        }
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is salt factor which determines the complexity of password (10 is default)
        console.log("Password hashed sucessfully");

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
    console.log("Logged in candidate ...")
    const { email, password } = req.body;
    try {
        const candidate = await Register.findOne({ email });
        if (!candidate) {
            console.log("Candidate not found")
            return res.status(404).json({ message: 'Candidate not found' });
        }else{
            console.log("Candidate found");
        }
        const match = await bcrypt.compare(password, candidate.password);
        console.log("hashed password comparing");

        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }else{
            console.log("Credentitals matched")
        }
        const token = jwt.sign({ id: candidate._id, email: candidate.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, candidate: { id: candidate._id, name: candidate.name, email: candidate.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add or update candidate profile
const addProfile = async (req, res) => {
    console.log("Add Profile hit...")
    try {
        const {
             dob,
             marks,
             university,
             skills,
             company,
             role,
             workExperience,
             working } = req.body;
        console.log("params requested from body")
        const Id = req.params.id; // Candidate ID from URL
        console.log("Id requested from url")
        const candidate = await Register.findById(Id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }else{
            console.log("Candidate found")
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
                console.log(`Resume renamed ${resumePath}`)
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
    console.log("Fetch profile hit..")
    try {
        const loggedInCandidateId = req.candidate.id;
        console.log('Candidate id requested from login schema')
        const requestedCandidateId = req.params.id;
        console.log('Candidate id requested from url')
        if (String(loggedInCandidateId) !== String(requestedCandidateId)) {
            console.log("Requested id do not match with login id")
            return res.status(403).json({ message: 'Access denied. You can only view your own profile.' });
        }else{
            console.log("Ids matched")
        }
        const candidate = await Register.findById(requestedCandidateId);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }else{
            console.log("Candidate found")
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
    console.log("Fetch all jobs hit...")
    try {
        const jobs = await Job.find().populate('hrId', 'name email');
        res.status(200).json({ message: 'Jobs fetched successfully', jobs });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Apply for a job
const applyForJob = async (req, res) => {
    console.log("Apply for job hit..");
    const jobId = req.params.jobId; // Extract jobId from the URL parameters
    console.log(`Job ID is ${jobId}`);

    const candidateId = req.candidate.id; // Get candidate ID from the token decoded from middleware

    try {
        // Fetch candidate profile details
        const profile = await Profile.findOne({ candidate_id: candidateId });
        if (!profile) {
            console.log('Candidate profile not found');
            return res.status(404).json({ message: 'Candidate profile not found' });
        }

        // Check if the candidate has already applied for this job
        const existingApplication = await Application.findOne({ candidateId, jobId });
        if (existingApplication) {
            console.log('Candidate has already applied for this job');
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        // Create a new application with the required fields
        const newApplication = new Application({
            candidateId,
            jobId,
            name: profile.name,
            email: profile.email,
            skills: profile.skills,
            workExperience: profile.workExperience,
            resume: profile.resume,
        });

        // Save the application
        const savedApplication = await newApplication.save();
        console.log('Application saved:', savedApplication);

        // Fetch HR email from the job posting
        const hrDetails = await Job.findOne({ jobId }).populate('hrId', 'email');
        // Ensure hrId is populated to get the email
        const hrEmail = hrDetails && hrDetails.hrId ? hrDetails.hrId.email : process.env.DEFAULT_HR_EMAIL; // Fallback if HR email is not found

        // Email configuration using Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can also use other email services like Outlook, Yahoo, etc.
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to: hrEmail, // Recipient HR email
            subject: `New Job Application from ${profile.name}`, // Subject line
            text: `Dear HR,\n\n${profile.name} has applied for the job (Job ID: ${jobId}).\n\nCandidate Details:\nName: ${profile.name}\nEmail: ${profile.email}\nSkills: ${profile.skills.join(', ')}\nWork Experience: ${profile.workExperience}\n\nBest regards,\nYour Recruitment Portal`, // Plain text body
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        // Send response on successful application
        res.status(200).json({
            message: 'Application submitted successfully!',
            application: savedApplication, // Return the saved application details
        });
    } catch (error) {
        console.error('Error applying for job:', error); // Log any errors
        res.status(500).json({ error: 'An error occurred while applying for the job.' });
    }
};

  module.exports = { 
    loginCandidate,
    registerCandidate,
    getCandidateProfile,
    getAllJobs,
    addProfile,
    applyForJob,
};
  