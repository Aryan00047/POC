const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

console.log("admin routes accessed")

// Admin login
router.post('/login', adminController.loginAdmin);

module.exports = router;