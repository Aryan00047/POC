const express = require('express');
const { protectRoute } = require('../middleware/authMiddleware');
const hrController = require('../controllers/hrController');
const router = express.Router();

console.log("Hr routes accessed")

// Route for posting a job (only if logged in and hrId is provided in the route)
router.post('/postJob', protectRoute(['hr']), hrController.postJob);

// Route for fetching all candidates (HR must be authenticated)
router.get('/candidates', protectRoute(['hr']), hrController.fetchCandidates);

// Route for fetching candidate profile by email
 router.get('/candidates/email/:email', protectRoute(['hr']) , hrController.fetchCandidateProfile);

// Route for downloading a candidate's resume (HR must be authenticated)
router.get('/resume/email/:email', protectRoute(['hr']), hrController.downloadResumeHR);

router.get('/applications/:jobId', protectRoute(['hr']), hrController.getApplicationsByJobId);

router.patch('/applications/:applicationId/status', protectRoute(['hr']), hrController.updateApplicationStatus);
router.delete('/profile', protectRoute(['hr']), hrController.deleteHrProfile);

module.exports = router;
