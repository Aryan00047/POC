const multer = require("multer");
const path = require("path");
const { uploadFileToGridFS } = require("./gridfs");

// Set up storage configuration
const storage = multer.memoryStorage(); // Store the file in memory before uploading to GridFS

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|docx/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF and DOCX files are allowed."));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

// Middleware to upload to MongoDB GridFS
const uploadToGridFS = async (req, res, next) => {
  if (req.file) {
    try {
      const fileName = req.file.originalname;
      const filePath = req.file.buffer; // We use buffer for memory storage

      // Upload file to GridFS
      const fileId = await uploadFileToGridFS(filePath, fileName);

      // Store the file ID in the request for later use (e.g., saving to the database)
      req.fileId = fileId;
      next();
    } catch (err) {
      return res.status(500).json({
        error: "Error uploading file to MongoDB",
        details: err.message,
      });
    }
  } else {
    next();
  }
};

// Export upload and uploadToGridFS
module.exports = {
  upload, // Ensure this is being exported
  uploadToGridFS,
};
