const express = require('express');
const CsvController = require('../controllers/csvController');
const UserController = require('../controllers/userController');
const MonitorControler = require('../controllers/monitorController.js');
const OfficeController = require('../controllers/officeController.js');
const validateUser = require('../validators/userValidator');
const { handleValidationErrorsUser } = require('../middlewares/validationMiddleware');

const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();
const userController = new UserController();
const csvController = new CsvController();
const monitorController = new MonitorControler();
const officeController = new OfficeController();

/**
 * @route POST /monitor
 * @description Handle monitor data from IoT devices
 * @access Public
 */
router.post('/monitor', monitorController.postMonitor);

/**
 * @route GET /users/:id/image
 * @description Retrieve the profile image of a user by ID
 * @access Public
 */
router.get('/users/:id/image', userController.getImageProfileById);

/**
 * @route GET /offices/:id/image
 * @description Retrieve the image of an office by ID
 * @access Public
 */
router.get('/offices/:id/image', officeController.getImageOfficeById);

/**
 * @route GET /attendance/report/download
 * @description Download all attendance reports as a CSV file
 * @access Public
 */
router.get("/attendances/report/download", csvController.csvDownloadAll);

/**
 * @route GET /attendance/report/:id/download
 * @description Download an individual attendance report as a CSV file
 * @access Public
 */
router.get("/attendances/report/:id/download", csvController.csvDownloadIndividu);

module.exports = router;
