// routes/hr.js
const express = require('express');
const router = express.Router();
const { registerHR, loginHR,postJob } = require('../controllers/hrController');

// Route for HR registration
router.post('/register', registerHR);

// Route for HR login
router.post('/login', loginHR);

//Route for Job posting
router.post('/postJob/:id', postJob);

module.exports = router;
