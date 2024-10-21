const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { postJob, registerHR, loginHR, fetchCandidates, downloadResumeHR } = require('../controllers/hrController');


// Route for HR registration
router.post('/register', registerHR);

// Route for HR login
router.post('/login', loginHR);

// Route for posting a job (only if logged in and hrId is provided in the route)
router.post('/postJob/:hrId', authMiddleware.verifyTokenHR, postJob);

// Route for fetching all candidates (HR must be authenticated)
router.get('/candidates', authMiddleware.verifyTokenHR, fetchCandidates);

// Route for fetching candidate profile by ID
router.get('/candidates/id/:id', authMiddleware.verifyTokenHR, fetchCandidates);

// Route for fetching candidate profile by email
router.get('/candidates/email/:email', authMiddleware.verifyTokenHR, fetchCandidates);

// Route for downloading a candidate's resume (HR must be authenticated)
router.get('/resume/email/:email', authMiddleware.verifyTokenHR, downloadResumeHR);

module.exports = router;
