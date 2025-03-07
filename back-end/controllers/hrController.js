const Job = require('../models/hr/postJob');
const User = require('../models/userSchema'); 
const CandidateProfile = require('../models/candidate/profile');
const Application = require('../models/candidate/application')
const path = require('path');
const fs = require('fs').promises; // Use the promises API
const mongoose = require('mongoose');
const transporter = require('../middleware/emailTransporter');
const { selectEmailTemplate, rejectEmailTemplate } = require('../middleware/emailTemplates');
const { ObjectId } = require("mongoose").Types;
const { GridFSBucket } = require("mongodb");

const conn = mongoose.connection;
let gfs;

conn.once("open", () => {
  gfs = new GridFSBucket(conn.db, { bucketName: "uploads" }); // Adjust bucket name if needed
  console.log("GridFSBucket in hr initialized");
});

// Function to post a new job listing
const postJob = async (req, res) => {
    console.log("Job post hit...");
    const hrId = req.user.userId; // Assuming 'hrId' is available from the decoded token
  
    // Check if user is authorized (assuming 'hr' role is required)
    if (req.user.role !== 'hr') {
      console.log("You must be HR to access this...")
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
      console.log("Job posted successfully...", savedJob)
      res.status(201).json({ message: 'Job posted successfully', job: savedJob });
    } catch (error) {
      console.error("Error posting job:", error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

// Fetch all available jobs for candidates
const fetchAvailableJobs = async (req, res) => {
  try {
    // Find all jobs that are currently available (you may want to add filters for availability)
    const jobs = await Job.find().sort({ jobId: 1 }); // Sorting by jobId to show them in order

    if (!jobs.length) {
      console.log("No jobs Available currently")
      return res
        .status(404)
        .json({ message: "No jobs available at the moment." });
    }

    console.log("Jobs fetched sucessfully...")
    res.status(200).json({
      message: "Available jobs fetched successfully",
      jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      message: "Error fetching available jobs",
      error: error.message,
    });
  }
};

const fetchCandidates = async (req, res) => {
  try {
    console.log("Fetch candidates hit...");

    // Ensure the user is authenticated and has the HR role
    if (!req.user || req.user.role !== 'hr') {
      console.log("Unauthorized access. Only HR can access this route...");
      return res.status(403).json({ message: 'Access denied. Only HR can access this resource.' });
    }

    // Fetch all candidates from the User collection
    const candidates = await User.find({ role: 'candidate' }, 'name email');
    
    // Map candidates to include their profiles
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
          profile: profile ? {
            working: profile.working,
            skills: profile.skills,
          } : null,
        };
      })
    );

    console.log("Candidates fetched successfully...");
    res.status(200).json({ message: 'Candidates fetched successfully', candidates: candidatesWithProfiles });
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
        console.log("Candidate's profile not found...")
        return res.status(404).json({ message: 'Candidate profile not found' });
      }

      // Send full profile information in the response
      console.log("Candidate's profile fetched successfully: ", profile)
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
  try {
    const { email } = req.params; // Get candidate's email from request parameters

    // Verify if the requesting user is HR
    if (req.user.role !== "hr") {
      return res.status(403).json({ message: "Access denied. Only HR can download resumes." });
    }

    // Find the candidate using email in the User model
    const candidate = await User.findOne({ email, role: "candidate" });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found." });
    }

    // Fetch candidate's profile using the candidate's ID
    const profile = await CandidateProfile.findOne({ candidate_id: candidate._id });
    if (!profile || !profile.resume) {
      return res.status(404).json({ message: "Resume not found for this candidate." });
    }

    const fileId = new ObjectId(profile.resume); // Convert resume ID to ObjectId

    // **GridFS File Retrieval (If Using MongoDB Storage)**
    const files = await gfs.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: "Resume file not found in storage." });
    }

    // Set response headers for file download
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${files[0].filename}"`,
    });
  // Stream file to response for download
  const downloadStream = gfs.openDownloadStream(fileId);
  downloadStream.pipe(res);
  
} catch (error) {
  console.error("Error downloading resume:", error);
  res.status(500).json({ message: "Server error", error: error.message });
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
      console.log("Invalid jobId format. Must be a number or a valid ObjectId.")
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
      console.log("No applications found for this job...")
      return res.status(404).json({ message: 'No applications found for this job.' });
    }

    console.log("Applications fetched successfully...")
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
      console.log("Invalid applicationId format. Must be a number.")
      return res.status(400).json({ message: 'Invalid applicationId format. Must be a number.' });
    }
    if (typeof isSelected !== 'boolean') {
      console.log("Invalid isSelected value. Must be 'true' or 'false'.")
      return res.status(400).json({ message: 'Invalid isSelected value. Must be "true" or "false".' });
    }

    // Find the application by applicationId
    const application = await Application.findOne({ applicationId });
    if (!application) {
      console.log("Application  not found...")
      return res.status(404).json({ message: 'Application not found.' });
    }

    // Fetch job details using jobId
    const job = await Job.findById(application.jobId).select('company designation jobDescription package');
    if (!job) {
      console.log("Job details not found...")
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

    console.log("Candidate selected and email sent.' : 'Candidate rejected and email sent. ", application)
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
      console.log("HR account not found....")
      return res.status(404).json({ message: 'HR account not found.' });
    }

    console.log("HR account and associated jobs deleted successfully.")
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
    fetchAvailableJobs,
    fetchCandidates,
    fetchCandidateProfile,
    downloadResumeHR,
    getApplicationsByJobId,
    updateApplicationStatus,
    deleteHrProfile
  };