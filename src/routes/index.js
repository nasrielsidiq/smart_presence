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
const withoutMiddlewareRoutes = require('./withouMiddlewareRoute.js')



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
    // Middleware Global
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    
    // Monitor routes (Tanpa Authentication)
    router.post('/monitor', monitorController.postMonitor);

    // Auth routes (Tanpa Authentication)
    app.use('/api', authRoutes);
    app.use('/api', withoutMiddlewareRoutes);

    // Middleware Auth untuk semua route di bawahnya
    app.use('/api', authMiddleware);

    // Index routes (Hanya Login Required)
    app.use('/api', router);
    router.get('/', indexController.home);
    router.get('/data', indexController.getData);

    // On Leave routes (Hanya Login Required)
    app.use('/api', onLeaveRoutes);

    // 🔹 Role Middleware untuk Supervisor, Top Manager, Admin
    app.use('/api', roleMiddleware(['admin', 'supervisor', 'top manager']));

    // Profile routes (Hanya Supervisor, Top Manager, Admin)
    app.use('/api', profileRoutes);

    // Office CRUD routes (Hanya Supervisor, Top Manager, Admin)
    app.use('/api', officeRoutes);

    // Division CRUD routes (Hanya Supervisor, Top Manager, Admin)
    app.use('/api', divisionRoutes);

    // Attendance routes (Hanya Supervisor, Top Manager, Admin)
    app.use('/api', attendanceRoutes);

    // Dashboard routes (Hanya Supervisor, Top Manager, Admin)
    app.use('/api', dashboardRoutes);

    // 🔹 Role Middleware khusus untuk Admin saja
    app.use('/api', roleMiddleware(['admin']));

    // User CRUD routes (Hanya Admin)
    app.use('/api', userRoutes);

    // Employee CRUD routes (Hanya Admin)
    app.use('/api', employeeRoutes);
}


module.exports = { setRoutes };