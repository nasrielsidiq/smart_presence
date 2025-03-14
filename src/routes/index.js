const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
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
const path = require('path');
const rateLimit = require("express-rate-limit");
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');
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
    // Setup Global Middleware
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    // app.use(limiter);

    // Use router '/api' after all middleware is set up
    app.use('/api', router);

        // 🔹 Monitor routes (Without Authentication)
    router.post('/monitor', monitorController.postMonitor);

    // 🔹 Auth routes
    router.post('/login', authController.login);
    router.get('/logout', authController.logout);



    // 🔹 Authentication Middleware (Login Required)
    router.use(authMiddleware);

    // 🔹 Index routes
    router.get('/', indexController.home);
    router.get('/data', indexController.getData);

    // 🔹 Role Middleware for Supervisor, Top Manager, Admin
    router.use(roleMiddleware(['admin', 'supervisor', 'top manager']));

    // 🔹 Profile routes
    router.get('/me', userController.getCurrentUser);
    router.post('/me/update', userController.updateCurrentUser);

    // 🔹 Office CRUD routes
    router.post('/offices', validateOffice, handleValidationErrors, officeController.createOffice);
    router.get('/offices', officeController.getOffices);
    router.get('/offices/:id', officeController.getOfficeById);
    router.put('/offices/:id', validateOffice, handleValidationErrors, officeController.updateOffice);
    router.delete('/offices/:id', officeController.deleteOffice);

    // 🔹 Division CRUD routes
    router.post('/divisions', validateDivision, handleValidationErrors, divisionController.createDivision);
    router.get('/divisions', divisionController.getDivisions);
    router.get('/divisions/:id', divisionController.getDivisionById);
    router.put('/divisions/:id', validateDivision, handleValidationErrors, divisionController.updateDivision);
    router.delete('/divisions/:id', divisionController.deleteDivision);

    // 🔹 Attendance routes
    router.post('/attendances', attendanceController.attendancebySerialid);
    router.get('/attendances', attendanceController.getAttendances);
    router.get('/attendances/rank', attendanceController.checkRankAttendance);
    router.get('/attendances/:id', attendanceController.getAttendancesIndividu);
    router.get('/attendance/:id', attendanceController.checkEmployeeAttendance);

    // 🔹 Dashboard routes
    router.get('/dashboard', dashboardController.index);

    // 🔹 Fake route for testing
    router.post('/fakeRoute', (req, res) => {
        res.send('Fake Route');
    });

    // 🔹 Role Middleware for Admin Only
    router.use(roleMiddleware(['admin']));

    // 🔹 User CRUD routes
    router.post('/users', upload.single('image_profile'), validateUser, handleValidationErrors, userController.createUser);
    router.get('/users', userController.getUsers);
    router.get('/users/:id/image', userController.getImageProfileById);
    router.get('/users/:id', userController.getUserById);
    router.put('/users/:id', upload.single('image_profile'), validateUser, handleValidationErrors, userController.updateUser);
    router.delete('/users/:id', userController.deleteUser);

    // 🔹 Employee CRUD routes
    router.post('/employees', validateEmployee, handleValidationErrors, employeeController.create);
    router.get('/employees', employeeController.findAll);
    router.get('/employees/:id', employeeController.findById);
    router.put('/employees/:id', validateEmployee, handleValidationErrors, employeeController.update);
    router.delete('/employees/:id', employeeController.delete);
}

module.exports = { setRoutes };