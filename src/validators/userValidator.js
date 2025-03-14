const { body } = require('express-validator');

const validateUser = [
    body('username').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    // body('serial_id').notEmpty().withMessage('Serial ID is required'),
    body('privilage').isIn(['admin', 'supervisor', 'top manager']).withMessage('Invalid privilage'),
];

module.exports = validateUser;