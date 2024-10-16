const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const { registerHR, loginHR, postJob } = require('../controllers/hrController');

// Route for HR registration
router.post('/register', registerHR);

// Route for HR login
router.post('/login', loginHR);

// Route for posting job (only if logged in and hrId is provided in the route)
router.post('/postJob/:hrId', authMiddleware, postJob); // Change 'jobs' to 'postJob' for consistency

module.exports = router;
