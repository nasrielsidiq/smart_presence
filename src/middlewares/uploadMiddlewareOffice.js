const multer = require('multer');
const path = require('path');
const fs = require('fs');   

// Configure storage
const uploadsDir = path.resolve(__dirname, '../uploads/offices');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads folder created!');
} else {
    console.log('Uploads folder already exists!');
}

const storage = multer.diskStorage({
    /**
     * Set the destination for uploaded files.
     * @param {Object} req - The request object.
     * @param {Object} file - The file object.
     * @param {Function} cb - The callback function.
     */
    destination: function (req, file, cb) {
        cb(null, uploadsDir); // Storage folder
    },
    /**
     * Set the filename for uploaded files.
     * @param {Object} req - The request object.
     * @param {Object} file - The file object.
     * @param {Function} cb - The callback function.
     */
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); // Get file extension
        cb(null, Date.now() + ext); // Unique name based on timestamp
    }
});

/**
 * File filter to allow only images.
 * @param {Object} req - The request object.
 * @param {Object} file - The file object.
 * @param {Function} cb - The callback function.
 */
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'), false);
    }
};

// Initialize Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // File size limit 2MB
});

module.exports = upload;
