const express = require('express');
const AttendanceController = require('../controllers/attendanceController');
const router = express.Router();
const attendanceController = new AttendanceController();

/**
 * @route POST /attendances
 * @description Create or update an attendance record by serial ID
 * @access Authenticated User
 */
router.post('/attendances', attendanceController.attendancebySerialid);

/**
 * @route GET /attendances
 * @description Retrieve all attendance records
 * @access Admin
 */
router.get('/attendances', attendanceController.getAttendances);

/**
 * @route GET /attendance/individual
 * @description Retrieve individual attendance report
 * @access Authenticated User
 */
router.get('/attendances/individual', attendanceController.individualReport);

/**
 * @route GET /attendances/rank
 * @description Retrieve attendance ranking
 * @access Admin
 */
router.get('/attendances/rank', attendanceController.checkRankAttendance);

/**
 * @route GET /attendances/:id
 * @description Retrieve individual attendance records for a specific employee
 * @access Admin
 */
router.get('/attendances/:id', attendanceController.getAttendancesIndividu);

/**
 * @route GET /attendance/:id
 * @description Check employee attendance for the current day
 * @access Admin
 */
router.get('/attendance/:id', attendanceController.checkEmployeeAttendance);

module.exports = router;