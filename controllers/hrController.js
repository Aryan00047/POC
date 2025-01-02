const Job = require('../models/hr/postJob');
const User = require('../models/userSchema'); 
const CandidateProfile = require('../models/candidate/profile');
const Application = require('../models/candidate/application')
const path = require('path');
const nodemailer = require('nodemailer');
const fs = require('fs').promises; // Use the promises API
const mongoose = require('mongoose');

// Function to post a new job listing
const postJob = async (req, res) => {
    console.log("Job post hit...");
    const hrId = req.user.userId; // Assuming 'hrId' is available from the decoded token
  
    // Check if user is authorized (assuming 'hr' role is required)
    if (req.user.role !== 'hr') {
      return res.status(403).json({ message: 'Access denied. Not an HR.' });
    }
  
    const { company, designation, jobDescription, experienceRequired, package } = req.body;
  
    try {
      const hr = await User.findById(hrId);
      // Fetch the latest jobId to generate the next jobId
      const latestJob = await Job.findOne().sort({ jobId: -1 }).exec();
  
      // Ensure nextJobId is a number and handle the case where there are no jobs yet
      const nextJobId = latestJob && latestJob.jobId ? latestJob.jobId + 1 : 1;
  
      const newJob = new Job({
        jobId: nextJobId,
        hrId,
        company,
        designation,
        jobDescription,
        experienceRequired,
        package,
        name: hr.name,
        email : hr.email
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
    console.log("Fetch candidates hit...");
    
    try {
        // Check if the user is authorized (assuming only 'hr' can access this endpoint)
        if (req.user.role !== 'hr') {
            return res.status(403).json({ message: 'Access denied. Not an HR.' });
        }

        // Fetch all candidates from the User collection
        const candidates = await User.find({ role: 'candidate' }, 'name email');
        
        // Map candidates to their profiles
        const candidatesWithProfiles = await Promise.all(
            candidates.map(async (candidate) => {
                const profile = await CandidateProfile.findOne(
                    { candidate_id: candidate._id },
                    'working skills'
                );
                return {
                    candidate: {
                        name: candidate.name,
                        email: candidate.email,
                    },
                    profile: profile
                        ? {
                              working: profile.working,
                              skills: profile.skills,
                          }
                        : null,
                };
            })
        );

        res.status(200).json({
            message: 'Candidates fetched successfully',
            candidates: candidatesWithProfiles,
        });
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Fetch full candidate profile by email
const fetchCandidateProfile = async (req, res) => {
  console.log("Fetch full profile of candidate hit...");
  
  try {
      const { email } = req.params; // Get the email from the request parameters

      // Find the profile using email (case-insensitive)
      const profile = await CandidateProfile.findOne({ email: new RegExp(`^${email}$`, 'i') });

      // Check if the profile exists
      if (!profile) {
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
              resume: profile.resume,
          },
      });
  } catch (error) {
      console.error("Error fetching candidate profile:", error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Download Resume
const downloadResumeHR = async (req, res) => {
  const { email } = req.params; // Get the candidate's email from the request parameters

  try {
      // Verify if the user making the request has the 'hr' role
      if (req.user.role !== 'hr') {
          return res.status(403).json({ message: 'Access denied. Only HR can download resumes.' });
      }

      // Find the candidate using the email in the User model
      const candidate = await User.findOne({ email, role: 'candidate' });
      if (!candidate) {
          return res.status(404).json({ message: 'Candidate not found.' });
      }

      // Fetch the candidate's profile using the candidate's ID
      const profile = await CandidateProfile.findOne({ candidate_id: candidate._id });
      if (!profile || !profile.resume) {
          return res.status(404).json({ message: 'Resume not found for this candidate.' });
      }

      // Get the resume path
      const resumePath = profile.resume;

      // Ensure the resume file exists using fs.promises
      try {
          await fs.access(resumePath); // Check if the file exists
      } catch {
          return res.status(404).json({ message: 'Resume file not found on the server.' });
      }

      // Define the downloads directory
      const downloadsDir = path.join(__dirname, '..', 'downloads');
      await fs.mkdir(downloadsDir, { recursive: true }); // Create the downloads directory if it doesn't exist

      // Get the resume file name
      const resumeFileName = path.basename(resumePath);

      // Define the destination path for the resume
      const destinationPath = path.join(downloadsDir, resumeFileName);

      // Copy the resume file from 'uploads' to 'downloads' directory
      await fs.copyFile(resumePath, destinationPath);

      // Send response indicating that the resume is saved in the downloads directory
      res.status(200).json({
          message: 'Resume downloaded and stored in the downloads directory successfully',
          downloadPath: destinationPath,
      });
  } catch (error) {
      console.error("Error fetching or saving resume:", error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//get job applications

const getApplicationsByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;

    let query = {};
    
    // Check if jobId is a numeric value
    if (!isNaN(jobId)) {
      // Numeric jobId: query by numericJobId field
      query = { numericJobId: parseInt(jobId, 10) };
    } 
    // Check if jobId is a valid ObjectId
    else if (mongoose.Types.ObjectId.isValid(jobId)) {
      // ObjectId jobId: query by the jobId ObjectId field
      query = { jobId: mongoose.Types.ObjectId(jobId) };
    } else {
      return res.status(400).json({
        error: 'Invalid jobId format. Must be a number or a valid ObjectId.',
      });
    }

    const applications = await Application.find(query)
      .populate('candidateId', 'name email skills') // Populate candidate details
      .exec();

    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: 'No applications found for this job.' });
    }

    res.status(200).json({
      message: 'Applications fetched successfully.',
      applications,
    });
  } catch (error) {
    console.error('Error fetching applications by jobId:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
  
// Mark candidate as selected for interview
const updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params; // Extracting applicationId from URL params
  const { isSelected } = req.body; // Extracting isSelected from request body

  try {
    // Validate if applicationId is a valid number
    if (isNaN(applicationId)) {
      return res.status(400).json({ message: 'Invalid applicationId format. Must be a number.' });
    }

    // Log the incoming isSelected value for debugging purposes
    console.log('Incoming isSelected value:', isSelected);

    // Validate isSelected value
    if (typeof isSelected !== 'boolean') {
      return res.status(400).json({ message: 'Invalid isSelected value. Must be "true" or "false".' });
    }

    // Find and update the application using numeric applicationId
    const updatedApplication = await Application.findOneAndUpdate(
      { applicationId: parseInt(applicationId, 10) }, // Use numeric applicationId in query
      { isSelected },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    res.status(200).json({
      message: 'Application status (isSelected) updated successfully.',
      application: updatedApplication,
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      message: 'Error updating application status',
      error: error.message,
    });
  }
};

// const selectCandidateForInterview = async (req, res) => {
//     const { jobId } = req.body;
//     const candidateEmail = req.params.email; // no need to destructure
  
//     try {

//     console.log("Checking for candidate email:", candidateEmail);
//     console.log("Checking for job ID:", jobId);
//       // Check if the candidate has applied for the job
//       const application = await Application.findOne({ email: candidateEmail, jobId: jobId });
//       if (!application) {
//         return res.status(404).json({ message: 'Candidate has not applied for this job' });
//       }
  
//       // Mark candidate as selected
//       application.isSelected = true; // Correct field name
//       await application.save();
  
//       // Fetch candidate details
//       const candidate = await Candidate.findOne({ email: candidateEmail });
//       if (!candidate) {
//         return res.status(404).json({ message: 'Candidate not found' });
//       }
  
//       // Send email to the candidate
//       const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASSWORD,
//         },
//       });
  
//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: candidate.email,
//         subject: `Interview Selection for Job ID: ${jobId}`,
//         text: `Dear ${candidate.name},\n\nCongratulations! You have been selected for an interview for the job you applied for (Job ID: ${jobId}).\n\nBest regards,\nYour Recruitment Team`,
//       };
  
//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.error('Error sending email:', error);
//           return res.status(500).json({ message: 'Error sending email', error });
//         } else {
//           console.log('Email sent:', info.response);
//           return res.status(200).json({ message: 'Candidate selected for interview and email sent' });
//         }
//       });
  
//     } catch (error) {
//       return res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   };

  module.exports = { 
    postJob,
    fetchCandidates,
    fetchCandidateProfile,
    downloadResumeHR,
    getApplicationsByJobId,
    updateApplicationStatus
  };