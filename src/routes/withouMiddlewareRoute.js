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

router.post('/monitor', monitorController.postMonitor);

router.get('/users/:id/image', userController.getImageProfileById);

router.get('/offices/:id/image', officeController.getImageOfficeById);

router.get("/attendance/report/download", csvController.csvDownloadAll);

module.exports = router;
