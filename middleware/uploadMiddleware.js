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
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5 MB 1024 -- 1KB 1024*1024 -- 1MB
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|doc|docx/; // Allow only specific file types
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // verifies ext name
        const mimetype = filetypes.test(file.mimetype);
        //mimetype also verifies the ext name but it also verifies the content within the file.
        //Double verification is done due to security reasons

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: File upload only supports the following filetypes - ' + filetypes);
        }
    }
});

console.log("upload middleware called") 

module.exports = upload;
