const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

/**
 * Middleware to handle validation errors.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

/**
 * Middleware to handle validation errors for user routes.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const handleValidationErrorsUser = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const uploadsDir = path.resolve(__dirname, '../uploads/users');

        // Delete file if already uploaded
        if (req.file) {
            const filePath = path.join(uploadsDir, req.file.filename);
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath); // Delete file
                }
            } catch (err) {
                console.error('Error deleting file:', err);
            }
        }

        return res.status(400).json({ errors: errors.array() });
    }
    
    next();
};

module.exports = { handleValidationErrors, handleValidationErrorsUser };