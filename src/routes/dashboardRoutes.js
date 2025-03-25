const express = require('express');
const DashboardController = require('../controllers/dashboardController.js');
const router = express.Router();
const dashboardController = new DashboardController();

/**
 * @route GET /dashboard
 * @description Retrieve dashboard data
 * @access Admin
 */
router.get('/dashboard', dashboardController.index);

/**
 * @route GET /dashboard/chart
 * @description Retrieve dashboard chart data
 * @access Admin
 */
router.get('/dashboard/chart', dashboardController.chart);

module.exports = router;