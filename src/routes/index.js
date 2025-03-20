const express = require('express');
const cors = require('cors');
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

const router = express.Router();
const path = require('path');
const rateLimit = require("express-rate-limit");
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roleMiddleware');
const indexController = new IndexController();
const monitorController = new MonitorControler();

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

    
    // Monitor routes (Without Authentication)
    router.post('/monitor', monitorController.postMonitor);
    
    // Auth routes
    app.use('/api', authRoutes);
    
    // Use router '/api' after all middleware is set up
    app.use('/api', router);
    
    // Authentication Middleware (Login Required)
    router.use(authMiddleware);

    // Index routes
    router.get('/', indexController.home);
    router.get('/data', indexController.getData);

    // On Leave routes
    app.use('/api', onLeaveRoutes);

    // Role Middleware for Supervisor, Top Manager, Admin
    router.use(roleMiddleware(['admin', 'supervisor', 'top manager']));

    // Profile routes
    app.use('/api', profileRoutes);

    // Office CRUD routes
    app.use('/api', officeRoutes);

    // Division CRUD routes
    app.use('/api', divisionRoutes);

    // Attendance routes
    app.use('/api', attendanceRoutes);

    // Dashboard routes
    app.use('/api', dashboardRoutes);

    // Role Middleware for Admin Only
    router.use(roleMiddleware(['admin']));

    // User CRUD routes
    app.use('/api', userRoutes);

    // Employee CRUD routes
    app.use('/api', employeeRoutes);

}

module.exports = { setRoutes };