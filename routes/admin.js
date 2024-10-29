const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

console.log("admin routes accessed")

// Admin login
router.post('/login', adminController.loginAdmin);

//fetch candidates
router.post('/candidates', authMiddleware.verifyTokenAdmin, adminController.fetchCandidates)

//fetch hr
router.post('/hr', authMiddleware.verifyTokenAdmin, adminController.fetchHr)

module.exports = router;