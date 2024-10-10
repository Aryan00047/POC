// routes/hr.js
const express = require('express');
const router = express.Router();
const { registerHR, loginHR } = require('../controllers/hrController');

// Route for HR registration
router.post('/register', registerHR);

// Route for HR login
router.post('/login', loginHR);

module.exports = router;
