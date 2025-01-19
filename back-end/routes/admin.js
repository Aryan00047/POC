const express = require('express');
const { protectRoute } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Routes for admin functions
router.get('/employees', protectRoute(['admin']), adminController.viewEmployees); // View all employees
router.get('/candidates', protectRoute(['admin']), adminController.viewCandidates);
router.get('/applications', protectRoute(['admin']), adminController.viewApplications); // View all applications
router.get('/hr/:email', protectRoute(['admin']), adminController.viewHrByEmail); // View HR details and jobs
router.delete('/candidate/:email', protectRoute(['admin']), adminController.deleteCandidateByEmail); // Delete candidate
router.delete('/hr/:email', protectRoute(['admin']), adminController.deleteHrByEmail); // Delete HR account
router.patch('/application/:applicationId', protectRoute(['admin']), adminController.updateApplicationStatus); // Update application status

module.exports = router;