const express = require('express');
const cors = require('cors');
const { format } = require('fast-csv');
const helmet = require('helmet');
var bodyParser = require('body-parser');
const IndexController = require('../controllers/index.js');
const MonitorControler = require('../controllers/monitorController.js');
const employeeRoutes = require('./employeeRoutes');
const userRoutes = require('./userRoutes');
const onLeaveRoutes = require('./onLeaveRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const divisionRoutes = require('./divisionRoutes');
const officeRoutes = require('./officeRoutes');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const withoutMiddlewareRoutes = require('./withouMiddlewareRoute.js');
const deviceRoutes = require('./deviceRoutes');
const CsvController = require('../controllers/csvController');
const UserController = require('../controllers/userController');
const OfficeController = require('../controllers/officeController.js');

const router = express.Router();
const path = require('path');
const rateLimit = require("express-rate-limit");
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roleMiddleware');
const indexController = new IndexController();
const monitorController = new MonitorControler();
const userController = new UserController();
const csvController = new CsvController();
const officeController = new OfficeController();

/**
 * Rate limiter middleware to limit requests.
 * Limits the number of requests from a single client within a specific time window.
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
    // Middleware Global
    app.use(cors()); // Enable Cross-Origin Resource Sharing
    app.use(express.json()); // Parse incoming JSON requests
    app.use(helmet()); // Add security headers to requests
    app.use(bodyParser.json()); // Parse JSON bodies
    app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded bodies
    app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the 'uploads' directory

    /**
     * Auth routes (No Authentication Required)
     * Includes login and routes that do not require authentication.
     */
    app.use('/api', authRoutes);
    app.use('/api', withoutMiddlewareRoutes);

    /**
     * Middleware for Authentication
     * Ensures all routes below this middleware require authentication.
     */
    app.use('/api', authMiddleware);

    /**
     * Index routes (Login Required)
     * Includes general routes accessible to authenticated users.
     */
    app.use('/api', router);
    router.get('/', indexController.home); // Home route
    router.get('/data', indexController.getData); // Data route

    /**
     * On Leave routes (Login Required)
     * Routes for managing employee leave records.
     */
    app.use('/api', onLeaveRoutes);

    /**
     * Role Middleware for Supervisor, Top Manager, and Admin
     * Ensures only users with specific roles can access the routes below.
     */
    app.use('/api', roleMiddleware(['admin', 'supervisor', 'top manager']));

    /**
     * Profile routes (Supervisor, Top Manager, Admin)
     * Routes for managing the profile of the currently logged-in user.
     */
    app.use('/api', profileRoutes);

    /**
     * Office CRUD routes (Supervisor, Top Manager, Admin)
     * Routes for managing office records.
     */
    app.use('/api', officeRoutes);

    /**
     * Division CRUD routes (Supervisor, Top Manager, Admin)
     * Routes for managing division records.
     */
    app.use('/api', divisionRoutes);

    /**
     * Attendance routes (Supervisor, Top Manager, Admin)
     * Routes for managing attendance records.
     */
    app.use('/api', attendanceRoutes);

    /**
     * Dashboard routes (Supervisor, Top Manager, Admin)
     * Routes for retrieving dashboard data and charts.
     */
    app.use('/api', dashboardRoutes);

    /**
     * Role Middleware for Admin Only
     * Ensures only users with the 'admin' role can access the routes below.
     */
    app.use('/api', roleMiddleware(['admin']));

    /**
     * User CRUD routes (Admin Only)
     * Routes for managing user accounts.
     */
    app.use('/api', userRoutes);

    /**
     * Employee CRUD routes (Admin Only)
     * Routes for managing employee records.
     */
    app.use('/api', employeeRoutes);

    /**
     * Device CRUD routes (Admin Only)
     * Routes for managing device records.
     */
    app.use('/api', deviceRoutes);
    
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
}

module.exports = { setRoutes };