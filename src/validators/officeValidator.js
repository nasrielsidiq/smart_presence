const { body } = require('express-validator');

const validateOffice = [
    body('name').notEmpty().withMessage('Name is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('address').notEmpty().withMessage('Address is required')
];

module.exports = validateOffice;