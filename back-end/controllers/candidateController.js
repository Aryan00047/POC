const path = require("path");
const fs = require("fs").promises; // To use async/await with fs
const Profile = require("../models/candidate/profile"); // Assuming you have the Profile model imported
const User = require("../models/userSchema"); // Assuming you have the User model imported
const Application = require("../models/candidate/application"); // Assuming Application model
const Job = require("../models/hr/postJob"); // Assuming you have a Job model
const mongoose = require("mongoose");
const transporter = require("../middleware/emailTransporter");
const { newApplicationEmailTemplate } = require("../middleware/emailTemplates");
const GridFSBucket = mongoose.mongo.GridFSBucket;
const conn = mongoose.connection;
const { ObjectId } = require("mongoose").Types;
let gfs;

// Initialize GridFSBucket once the MongoDB connection is open
conn.once("open", () => {
    gfs = new GridFSBucket(conn.db, { bucketName: "uploads" }); // Ensure "uploads" matches your storage bucket
    console.log("GridFSBucket initialized");
});

const registerProfile = async (req, res) => {
  const {
    dob,
    marks,
    university,
    skills,
    company,
    designation,
    workExperience,
    working,
  } = req.body;
  const candidateId = req.user.userId;
  const resumeBuffer = req.file ? req.file.buffer : null;
  const resumeName = req.file ? req.file.originalname : null;

  try {
    // Check if user is a candidate
    const candidate = await User.findById(candidateId);
    if (!candidate || candidate.role !== "candidate") {
      return res.status(403).json({ message: "Access denied. Not a candidate." });
    }

    // Check if profile already exists
    const existingProfile = await Profile.findOne({ candidate_id: candidateId });
    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists. Use PUT to update." });
    }

    // Ensure GridFS is initialized
    if (!gfs) {
      console.error("GridFSBucket is not initialized!");
      return res.status(500).json({ message: "Server error: GridFSBucket is not initialized." });
    }

    let resumeId = null;
    if (resumeBuffer) {
      const uploadStream = gfs.openUploadStream(resumeName, { contentType: "application/pdf" });

      // Wait for the upload to complete
      await new Promise((resolve, reject) => {
        uploadStream.end(resumeBuffer, (err) => {
          if (err) {
            console.error("Error uploading resume to GridFS:", err);
            return reject(err);
          }
          resumeId = uploadStream.id;
          resolve();
        });
      });
    }

    // Create new profile
    const newProfile = new Profile({
      candidate_id: candidateId,
      name: candidate.name,
      email: candidate.email,
      dob,
      marks,
      university,
      skills,
      company,
      designation,
      workExperience,
      working,
      resume: resumeId, // Store GridFS file ID
    });

    await newProfile.save();
    return res.status(201).json({ message: "Profile registered successfully", profile: newProfile });

  } catch (error) {
    console.error("Error registering profile:", error);
    return res.status(500).json({ message: "Error registering profile", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { dob, marks, university, skills, company, designation, workExperience, working } = req.body;
  const candidateId = req.user.userId;

  try {
    const candidate = await User.findById(candidateId);
    if (!candidate || candidate.role !== "candidate") {
      return res.status(403).json({ message: "Access denied. Not a candidate." });
    }

    const existingProfile = await Profile.findOne({ candidate_id: candidateId });
    if (!existingProfile) {
      return res.status(404).json({ message: "Profile not found. Use POST to register." });
    }

    // Keep old resume if no new file is uploaded
    const updatedResume = req.fileId ? req.fileId.toString() : existingProfile.resume;

    const updateFields = {
      dob, marks, university, skills, company, designation, workExperience, working, resume: updatedResume,
    };

    const updatedCandidate = await Profile.findOneAndUpdate(
      { candidate_id: candidateId },
      updateFields,
      { new: true }
    );

    res.status(200).json({ message: "Profile updated successfully", resume: updatedCandidate.resume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    // Fetch the profile by candidate ID
    const profile = await Profile.findOne({ candidate_id: req.user.userId });

    if (!profile) {
      console.log("Profile not found...")
      return res.status(404).json({ message: "Profile not found" });
    }

    console.log("Profile fetched sucessfully: ", profile)
    res.status(200).json({
      message: "Profile fetched successfully.",
      profile,
    });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

const getResume = async (req, res) => {
  try {
    if (!gfs) {
      console.error("GridFS is not initialized");
      return res.status(500).json({ error: "Server error. Try again later." });
    }

    const candidateId = req.user.userId; // Get authenticated user ID
    const candidate = await User.findById(candidateId);

    if (!candidate || candidate.role !== "candidate") {
      return res.status(403).json({ message: "Access denied. Not a candidate." });
    }

    // Fetch candidate's profile
    const profile = await Profile.findOne({ candidate_id: candidateId });
    if (!profile) {
      return res.status(404).json({ error: "Candidate profile not found" });
    }

    // Check if resume exists
    if (!profile.resume) {
      return res.status(404).json({ error: "Please upload resume first" });
    }

    const fileId = new ObjectId(req.params.id); // ✅ Ensure it's a valid ObjectId

    console.log("Fetching resume with ID:", fileId);

    const files = await gfs.find({ _id: fileId }).toArray();
    
    if (!files || files.length === 0) {
      return res.status(404).json({ error: "Resume not found" });
    }

    // Log file details for debugging
    console.log("File found in GridFS:", files[0]);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${files[0].filename}"`,
    });

    const downloadStream = gfs.openDownloadStream(fileId);

    // Handle errors when streaming
    downloadStream.on("error", (err) => {
      console.error("Error streaming file:", err);
      return res.status(500).json({ error: "Error streaming file" });
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ error: "Server error" });
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

const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params; // Job ID from route params
    const candidateId = req.user.userId; // Candidate ID from JWT token

    // Validate numeric jobId
    const numericJobId = parseInt(jobId, 10);
    if (isNaN(numericJobId)) {
      return res
        .status(400)
        .json({ error: "Invalid jobId format. Must be a number." });
    }

    // Fetch the job details
    const job = await Job.findOne({ jobId: numericJobId });
    if (!job) {
      console.log("Job not found...")
      return res.status(404).json({ error: "Job not found" });
    }

    // Fetch HR's email from the User model
    const hr = await User.findById(job.hrId);
    if (!hr || hr.role !== "hr") {
      console.log("HR associated with this job not found to send email")
      return res
        .status(404)
        .json({ error: "HR associated with this job not found." });
    }

    // Fetch the candidate's profile
    const profile = await Profile.findOne({ candidate_id: candidateId });
    if (!profile) {
      console.log("Profile not found. Please update it...")
      return res.status(404).json({
        error: "Profile not found. Please update your profile before applying.",
      });
    }

    // Check for duplicate application
    const existingApplication = await Application.findOne({
      candidateId,
      jobId: job._id,
    });
    if (existingApplication) {
      console.log("Already applied for current job...")
      return res.status(400).json({
        error: "You have already applied for this job.",
      });
    }

    // Create and save the new application
    const newApplication = new Application({
      jobId: job._id,
      numericJobId: job.jobId,
      candidateId,
      name: profile.name,
      email: profile.email,
      skills: profile.skills,
      resume: profile.resume,
      workExperience: profile.workExperience,
    });

    await newApplication.save();

    // Prepare email template
    const emailTemplate = newApplicationEmailTemplate(hr, job, profile);

    // Send email to HR
    const mailOptions = {
      from: "your-email@example.com",
      to: hr.email, // Dynamically fetched HR email
      subject: `New Application for Job ID: ${job.jobId}`,
      html: emailTemplate, // Use HTML email template
      attachments: [
        {
          filename: "resume.pdf",
          path: profile.resume, // Attach candidate's resume
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent to HR:", info.response);

    res.status(201).json({
      message: "Application submitted successfully, and HR notified.",
      application: newApplication,
    });
  } catch (error) {
    console.error("Error applying for job:", error.message);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

const viewCandidateApplications = async (req, res) => {
  const candidateId = req.user.userId; // Candidate ID from the JWT token

  try {
    // Verify if the user is a candidate
    if (req.user.role !== "candidate") {
      console.log("You must be candidate to access this...")
      return res.status(403).json({
        message: "Access denied. Only candidates can view their applications.",
      });
    }

    // Check if candidateId is valid and convert to ObjectId
    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      console.log("Invalid candidate id format...")
      return res.status(400).json({ message: "Invalid candidate ID format." });
    }

    // Convert candidateId to ObjectId
    const objectId = new mongoose.Types.ObjectId(candidateId);

    // Fetch all applications submitted by the candidate and populate job details
    const applications = await Application.find({ candidateId: objectId })
      .populate({
        path: "jobId", // Populate the job details
        select: "designation company jobDescription experienceRequired package", // Select relevant job fields
        match: { _id: { $exists: true } }, // Ensure the jobId is valid
      })
      .populate("candidateId", "name email"); // Optional: Populate candidate details (name, email)

    if (!applications || applications.length === 0) {
      console.log("No applications found...")
      return res.status(404).json({ message: "No applications found." });
    }

    console.log("Applications fetched sucessfully...")
    res.status(200).json({
      message: "Applications fetched successfully",
      applications,
    });
  } catch (error) {
    console.error("Error fetching candidate applications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Candidate Profile and Applications
const deleteCandidateProfile = async (req, res) => {
  try {
    const candidateId = req.user.userId; // Get the candidateId from the authenticated user

    // Delete all applications for the candidate
    await Application.deleteMany({ candidateId });

    // Attempt to delete the candidate's profile (if it exists)
    const deletedProfile = await Profile.findOneAndDelete({
      candidate_id: candidateId,
    });

    if (!deletedProfile) {
      console.warn(
        "Candidate profile not found. Proceeding to delete user account."
      );
    }

    // Delete the user record from the User collection
    const deletedUser = await User.findOneAndDelete({ _id: candidateId });

    if (!deletedUser) {
      return res.status(404).json({ message: "User account not found." });
    }

    res.status(200).json({
      message:
        "Candidate account, associated applications, and profile (if any) deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting candidate profile and user:", error.message);
    res.status(500).json({ message: "Server error", details: error.message });
  }
};

module.exports = {
  updateProfile,
  registerProfile,
  getProfile,
  fetchAvailableJobs,
  applyForJob,
  viewCandidateApplications,
  deleteCandidateProfile,
  getResume
};