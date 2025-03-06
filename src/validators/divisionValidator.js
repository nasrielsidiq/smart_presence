const { body } = require('express-validator');

const validateDivision = [
    body('office_id').isInt().withMessage('Office ID must be an integer'),
    body('name').notEmpty().withMessage('Name is required'),
];

module.exports = validateDivision;