const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
const { validationResult } = require('express-validator');
const IndexController = require('../controllers/index.js');
const UserController = require('../controllers/userController.js');
const OfficeController = require('../controllers/officeController.js');
const DivisionController = require('../controllers/divisionController.js');
const EmployeeController = require('../controllers/employeeController');
const AuthController = require('../controllers/authController');
const AttendanceController = require('../controllers/attendanceController');
const DashboardController = require('../controllers/dashboardController.js');
const MonitorControler = require('../controllers/monitorController.js');

const validateEmployee = require('../validators/employeeValidator');
const validateUser = require('../validators/userValidator');
const validateDivision = require('../validators/divisionValidator');
const validateOffice = require('../validators/officeValidator');

const router = express.Router();
const rateLimit = require("express-rate-limit");
const indexController = new IndexController();
const userController = new UserController();
const officeController = new OfficeController();
const divisionController = new DivisionController();
const employeeController = new EmployeeController();
const authController = new AuthController();
const attendanceController = new AttendanceController();
const dashboardController = new DashboardController();
const monitorController = new MonitorControler();

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
 * Rate limiter middleware to limit requests.
 */
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Maximum 5 requests per minute
    message: "Too many requests from this IoT device.",
});

/**
 * Set up routes for the application.
 * @param {Object} app - The Express application object.
 */
function setRoutes(app) {
    app.use(cors());
    app.use('/api', router);
    app.use(express.json());
    app.use(limiter);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // Monitor routes
    router.post('/monitor', monitorController.postMonitor);

    // Index routes
    router.get('/', indexController.home);
    router.get('/data', indexController.getData);

    // Auth routes
    router.post('/login', authController.login);
    router.get('/logout', authController.logout);

    // User CRUD routes
    router.post('/users', validateUser, handleValidationErrors, userController.createUser);
    router.get('/users', userController.getUsers);
    router.get('/users/:id', userController.getUserById);
    router.put('/users/:id', validateUser, handleValidationErrors, userController.updateUser);
    router.delete('/users/:id', userController.deleteUser);

    // Office CRUD routes
    router.post('/offices', validateOffice, handleValidationErrors, officeController.createOffice);
    router.get('/offices', officeController.getOffices);
    router.get('/offices/:id', officeController.getOfficeById);
    router.put('/offices/:id', validateOffice, handleValidationErrors, officeController.updateOffice);
    router.delete('/offices/:id', officeController.deleteOffice);

    // Division CRUD routes
    router.post('/divisions', validateDivision, handleValidationErrors, divisionController.createDivision);
    router.get('/divisions', divisionController.getDivisions);
    router.get('/divisions/:id', divisionController.getDivisionById);
    router.put('/divisions/:id', validateDivision, handleValidationErrors, divisionController.updateDivision);
    router.delete('/divisions/:id', divisionController.deleteDivision);

    // Employee CRUD routes
    router.post('/employees', validateEmployee, handleValidationErrors, employeeController.create);
    router.get('/employees', employeeController.findAll);
    router.get('/employees/:id', employeeController.findById);
    router.put('/employees/:id', validateEmployee, handleValidationErrors, employeeController.update);
    router.delete('/employees/:id', employeeController.delete);

    // Attendance routes
    router.post('/attendances', attendanceController.attendancebySerialid);
    router.get('/attendances', attendanceController.getAttendances);
    router.get('/attendance/:id', attendanceController.checkEmployeeAttendance);

    // Dashboard routes
    router.get('/dashboard', dashboardController.index);

    // Fake route for testing
    router.post('/fakeRoute', (req, res) => {
        res.send('Fake Route');
    });
}

module.exports = { setRoutes };