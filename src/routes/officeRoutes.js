const express = require('express');
const OfficeController = require('../controllers/officeController.js');
const validateOffice = require('../validators/officeValidator');
const { handleValidationErrors } = require('../middlewares/validationMiddleware');
const router = express.Router();
const officeController = new OfficeController();
const upload = require('../middlewares/uploadMiddlewareOffice.js');
const { route } = require('./employeeRoutes.js');
/**
 * @route POST /offices
 * @description Create a new office
 * @access Admin
 */
router.post('/offices', upload.single('img_office'), validateOffice, handleValidationErrors, officeController.createOffice);

/**
 * @route GET /offices
 * @description Retrieve all offices
 * @access Admin
 */
router.get('/offices', officeController.getOffices);

router.get('/offices/cities', officeController.cities);

/**
 * @route GET /offices/:id
 * @description Retrieve an office by ID
 * @access Admin
 */
router.get('/offices/:id', officeController.getOfficeById);

/**
 * @route PUT /offices/:id
 * @description Update an office by ID
 * @access Admin
 */
router.put('/offices/:id', upload.single('img_office'), validateOffice, handleValidationErrors, officeController.updateOffice);

/**
 * @route DELETE /offices/:id
 * @description Delete an office by ID
 * @access Admin
 */
router.delete('/offices/:id', officeController.deleteOffice);

module.exports = router;