const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const HR = require('../models/hr/register');
const Job = require('../models/hr/postJob');
const Candidate = require('../models/candidate/register');
const CandidateProfile = require('../models/candidate/profile');
const Application = require('../models/candidate/application')
const path = require('path');
const nodemailer = require('nodemailer');
const fs = require('fs').promises; // Use the promises API

// HR Registration
const registerHR = async (req, res) => {
    console.log("RegisterHr hit...")
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
    console.log("Login Hr hit...")
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
    console.log("Job post hit...")
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
    console.log("Fetch candidates hit...")
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
    console.log("Fetch full profile of candidate hit...")
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

// Download Resume
const downloadResumeHR = async (req, res) => {
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

        // Ensure the resume file exists using fs.promises
        try {
            await fs.access(resumePath); // Check if the file exists
        } catch {
            return res.status(404).json({ message: 'Resume file not found on the server.' });
        }

        // Define the downloads directory
        const downloadsDir = path.join(__dirname, '..', 'downloads');
        await fs.mkdir(downloadsDir, { recursive: true }); // Create the downloads directory if it doesn't exist

        const resumeFileName = path.basename(profile.resume); // Get the resume file name
        const destinationPath = path.join(downloadsDir, resumeFileName); // Destination path for the resume

        // Copy the resume file from 'uploads' to 'downloads' directory
        await fs.copyFile(resumePath, destinationPath);

        // Send response indicating that the resume is saved in the downloads directory
        res.status(200).json({ message: 'Resume downloaded and stored in the downloads directory successfully', downloadPath: destinationPath });
    } catch (error) {
        console.error("Error fetching or saving resume:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



//get job applications
const getJobApplications = async (req, res) => {
    const jobId = parseInt(req.params.jobId); // Ensure jobId is treated as a number
    try {
        const applications = await Application.find({ jobId })  // Now jobId is treated as a number
            .populate('candidateId', 'name email skills resume workExperience') // Populate candidate details
            .exec();
        
        console.log(applications)

        // Fetch job details for the specified jobId
        const jobDetails = await Job.findOne({ jobId }); // Ensure you have a Job model defined

        // Merge job details into the applications
        const mergedApplications = applications.map(application => ({
            applicationId: application._id,
            candidate: {
                _id: application.candidateId._id,
                name: application.candidateId.name,
                email: application.candidateId.email,
                skills: application.skills,
                resume: application.resume,
                workExperience: application.workExperience,
            },
            jobDetails: {
                jobId: jobDetails.jobId,
                role: jobDetails.role,
                company: jobDetails.company,
                jobDescription: jobDetails.jobDescription,
                experienceRequired: jobDetails.experienceRequired,
                package: jobDetails.package,
            },
            appliedAt: application.appliedAt // Include appliedAt timestamp if needed
        }));
        res.status(200).json({ message: 'Job applications fetched successfully', applications: mergedApplications });
    } catch (error) {
        console.error('Error fetching job applications:', error);
        res.status(500).json({ error: 'Server error while fetching applications' });
    }
};

// Mark candidate as selected for interview
const selectCandidateForInterview = async (req, res) => {
    const { jobId } = req.body;
    const candidateEmail = req.params.email; // no need to destructure
  
    try {

    console.log("Checking for candidate email:", candidateEmail);
    console.log("Checking for job ID:", jobId);
      // Check if the candidate has applied for the job
      const application = await Application.findOne({ email: candidateEmail, jobId: jobId });
      if (!application) {
        return res.status(404).json({ message: 'Candidate has not applied for this job' });
      }
  
      // Mark candidate as selected
      application.isSelected = true; // Correct field name
      await application.save();
  
      // Fetch candidate details
      const candidate = await Candidate.findOne({ email: candidateEmail });
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
  
      // Send email to the candidate
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: candidate.email,
        subject: `Interview Selection for Job ID: ${jobId}`,
        text: `Dear ${candidate.name},\n\nCongratulations! You have been selected for an interview for the job you applied for (Job ID: ${jobId}).\n\nBest regards,\nYour Recruitment Team`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ message: 'Error sending email', error });
        } else {
          console.log('Email sent:', info.response);
          return res.status(200).json({ message: 'Candidate selected for interview and email sent' });
        }
      });
  
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


module.exports = { registerHR,
     loginHR,
     postJob,
     fetchCandidates,
     fetchCandidateProfile,
     downloadResumeHR,
     getJobApplications,
     selectCandidateForInterview
    };