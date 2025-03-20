const express = require('express');
const DashboardController = require('../controllers/dashboardController.js');
const router = express.Router();
const dashboardController = new DashboardController();

/**
 * Dashboard routes
 */
router.get('/dashboard', dashboardController.index);
router.get('/dashboard/chart', dashboardController.chart);

module.exports = router;