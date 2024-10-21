const multer = require('multer');
const path = require('path');

// Set up file storage and file naming strategy
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Store in uploads directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Name the file with a timestamp
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5 MB
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|doc|docx/; // Allow only specific file types
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: File upload only supports the following filetypes - ' + filetypes);
        }
    }
});

module.exports = upload;
