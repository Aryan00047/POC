const Job = require('../models/hr/postJob');
const User = require('../models/userSchema'); 
const CandidateProfile = require('../models/candidate/profile');
const Application = require('../models/candidate/application')
const path = require('path');
const fs = require('fs').promises; // Use the promises API
const mongoose = require('mongoose');
const transporter = require('../middleware/emailTransporter');
const { selectEmailTemplate, rejectEmailTemplate } = require('../middleware/emailTemplates');

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

    // Fetch applications and populate both candidate and job details
    const applications = await Application.find(query)
      .populate('candidateId', 'name email skills') // Populate candidate details
      .populate({
        path: 'jobId', // Populate job details
        select: 'designation company jobDescription experienceRequired package', // Select relevant job fields
      })
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
  const { applicationId } = req.params;
  const { isSelected } = req.body;

  try {
    // Validate applicationId and isSelected value
    if (isNaN(applicationId)) {
      return res.status(400).json({ message: 'Invalid applicationId format. Must be a number.' });
    }
    if (typeof isSelected !== 'boolean') {
      return res.status(400).json({ message: 'Invalid isSelected value. Must be "true" or "false".' });
    }

    // Find the application by applicationId
    const application = await Application.findOne({ applicationId });
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    // Fetch job details using jobId
    const job = await Job.findById(application.jobId).select('company designation jobDescription package');
    if (!job) {
      return res.status(404).json({ message: 'Job details not found.' });
    }

    // Fetch candidate details
    const candidate = await User.findById(application.candidateId).select('name email');

    // Update the application status
    application.isSelected = isSelected;
    await application.save();

    // Send email based on selection status
    const emailTemplate = isSelected
      ? selectEmailTemplate(candidate, job)
      : rejectEmailTemplate(candidate, job);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: candidate.email,
      subject: isSelected ? 'Congratulations! You are selected for the job' : 'Job Application Status',
      html: emailTemplate,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent to Candidate:", info.response);

    res.status(200).json({
      message: isSelected ? 'Candidate selected and email sent.' : 'Candidate rejected and email sent.',
      application,
    });

  } catch (error) {
    console.error('Error updating application status and sending email:', error);
    res.status(500).json({ message: 'Error updating application status', error: error.message });
  }
};

const deleteHrProfile = async (req, res) => {
  try {
    const hrId = req.user.userId; // Extract HR ID from the authenticated user

    // Delete all jobs created by the HR
    await Job.deleteMany({ hrId });

    // Delete the HR user record
    const deletedHr = await User.findOneAndDelete({ _id: hrId });

    if (!deletedHr) {
      return res.status(404).json({ message: 'HR account not found.' });
    }

    res.status(200).json({
      message: 'HR account and associated jobs deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting HR profile and account:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
};

  module.exports = { 
    postJob,
    fetchCandidates,
    fetchCandidateProfile,
    downloadResumeHR,
    getApplicationsByJobId,
    updateApplicationStatus,
    deleteHrProfile
  };