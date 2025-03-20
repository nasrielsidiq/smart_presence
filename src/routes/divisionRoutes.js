const express = require('express');
const DivisionController = require('../controllers/divisionController.js');
const validateDivision = require('../validators/divisionValidator');
const { handleValidationErrors } = require('../middlewares/validationMiddleware');
const router = express.Router();
const divisionController = new DivisionController();

/**
 * @route POST /divisions
 * @description Create a new division
 * @access Admin
 */
router.post('/divisions', validateDivision, handleValidationErrors, divisionController.createDivision);

/**
 * @route GET /divisions
 * @description Retrieve all divisions
 * @access Admin
 */
router.get('/divisions', divisionController.getDivisions);

/**
 * @route GET /divisions/:id
 * @description Retrieve a division by ID
 * @access Admin
 */
router.get('/divisions/:id', divisionController.getDivisionById);

/**
 * @route PUT /divisions/:id
 * @description Update a division by ID
 * @access Admin
 */
router.put('/divisions/:id', validateDivision, handleValidationErrors, divisionController.updateDivision);

/**
 * @route DELETE /divisions/:id
 * @description Delete a division by ID
 * @access Admin
 */
router.delete('/divisions/:id', divisionController.deleteDivision);

module.exports = router;