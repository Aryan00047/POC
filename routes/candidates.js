const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

console.log("Candidates routes accessed")
// Candidate registration
router.post('/register', candidateController.registerCandidate);

// Candidate login
router.post('/login', candidateController.loginCandidate);

// Add or update profile
router.put('/profile/:id', authMiddleware.verifyTokenCandidate, upload.single('resume'), candidateController.addProfile);

// Get candidate profile
router.get('/profile/:id', authMiddleware.verifyTokenCandidate, candidateController.getCandidateProfile);

// Get all jobs
router.get('/jobs', authMiddleware.verifyTokenCandidate, candidateController.getAllJobs);

//Apply for a job
router.post('/apply/:jobId',authMiddleware.verifyTokenCandidate,(req,res,next) => {
    console.log("Apply job route hit, job id: ", req.params.jobId);
    next();
}, candidateController.applyForJob)

module.exports = router;