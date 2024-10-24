const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

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

module.exports = router;