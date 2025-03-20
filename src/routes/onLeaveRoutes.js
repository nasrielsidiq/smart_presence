const express = require('express');
const OnLeaveController = require('../controllers/onLeaveController.js');
const router = express.Router();
const onLeaveController = new OnLeaveController();

/**
 * @route POST /on-leave
 * @description Create a new leave record
 * @access Admin
 */
router.post('/on-leave', onLeaveController.createLeave);

/**
 * @route GET /on-leave
 * @description Retrieve all leave records
 * @access Admin
 */
router.get('/on-leave', onLeaveController.getLeaves);

/**
 * @route GET /on-leave/:id
 * @description Retrieve a leave record by ID
 * @access Admin
 */
router.get('/on-leave/:id', onLeaveController.getLeaveById);

/**
 * @route PUT /on-leave/:id
 * @description Update a leave record by ID
 * @access Admin
 */
router.put('/on-leave/:id', onLeaveController.updateLeave);

/**
 * @route DELETE /on-leave/:id
 * @description Delete a leave record by ID
 * @access Admin
 */
router.delete('/on-leave/:id', onLeaveController.deleteLeave);

module.exports = router;