const { body } = require('express-validator');

const validateEmployee = [
    body('serial_id').notEmpty().withMessage('Serial ID is required'),
    body('office_id').isInt().withMessage('Office ID must be an integer'),
    body('division_id').isInt().withMessage('Division ID must be an integer'),
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('position').notEmpty().withMessage('Position is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('no_hp').isMobilePhone('id-ID').withMessage('Invalid phone number'),
];

module.exports = validateEmployee;
