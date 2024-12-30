const express = require('express');
const { protectRoute } = require('../middleware/authMiddleware');
const { updateOrCreateProfile, getProfile } = require('../controllers/candidateController');
const upload = require('../middleware/uploadMiddleware'); 
const router = express.Router();

// Routes to handle candidate profile actions
router.post('/profile', protectRoute(['candidate']), upload.single('resume'), updateOrCreateProfile);
router.get('/profile', protectRoute(['candidate']), getProfile);

module.exports = router;
