const multer = require('multer');
const path = require('path');

// Set up storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination folder for uploaded files
    cb(null, 'uploads/'); // 'uploads/' directory
  },
  filename: function (req, file, cb) {
    // Ensure req.user is available and email exists
    if (!req.user || !req.user.email) {
      return cb(new Error('User not authenticated or email missing'));
    }
    
    // Sanitize email to remove special characters
    const email = req.user.email.replace(/[^a-zA-Z0-9]/g, '_'); 
    const fileExtension = path.extname(file.originalname); // Get file extension
    cb(null, `${email}${fileExtension}`); // Save file with email as the filename
  },
});

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Only allow certain file types (e.g., PDF, DOCX)
    const allowedTypes = /pdf|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

module.exports = upload;
