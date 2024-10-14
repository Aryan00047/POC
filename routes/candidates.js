const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authmiddleware');

const {
  registerCandidate,
  loginCandidate,
  addProfile,
  // getCandidateProfile
} = require('../controllers/candidateController');
const Candidate = require('../models/candidate/register'); // Import the model to retrieve candidates

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the local directory for file storage
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Create a unique filename with extension
  }
});

// Create an instance of multer
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/; // Example: allow only PDF and Word documents
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Error: File upload only supports the following filetypes - ' + filetypes));
    }
  }
});

// Route for registering a candidate
router.post('/register', registerCandidate);

// Route for candidate login
router.post('/login', loginCandidate);

// Route for adding/updating candidate profile with file upload
router.put('/profile/:id',authMiddleware, upload.single('resume'), addProfile);



// Route for getting candidate profile
// router.get('/profile/:id', getCandidateProfile);

// Route to get all candidates (optional)
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
