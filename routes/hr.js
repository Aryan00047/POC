const express = require('express');
const router = express.Router();
const { protectRoute } = require('../middleware/authMiddleware');
const hrController = require('../controllers/hrController');

console.log("Hr routes accessed")

// Route for posting a job (only if logged in and hrId is provided in the route)
router.post('/postJob', protectRoute['hr'], hrController.postJob);

// // Route for fetching all candidates (HR must be authenticated)
// router.get('/candidates', authMiddleware.verifyTokenHR, hrController.fetchCandidates);

// // Route for fetching candidate profile by email
// router.get('/candidates/email/:email', authMiddleware.verifyTokenHR, hrController.fetchCandidateProfile);

// // Route for downloading a candidate's resume (HR must be authenticated)
// router.get('/resume/email/:email', authMiddleware.verifyTokenHR, hrController.downloadResumeHR);

// //Route for job applications
// router.get('/jobApplications/:jobId', authMiddleware.verifyTokenHR, hrController.getJobApplications);

// //Route for selecting candidates
// router.post('/selectCandidates/email/:email', authMiddleware.verifyTokenHR, hrController.selectCandidateForInterview)

module.exports = router;
