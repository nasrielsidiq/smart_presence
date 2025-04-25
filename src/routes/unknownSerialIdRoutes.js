const express = require('express');
const UnknownSerialIdController = require('../controllers/unknownSerialIdController');
const router = express.Router();
const unknownSerialIdController = new UnknownSerialIdController();

/**
 * @route POST /unknown-serial-ids
 * @description Create a new unknown serial ID record
 * @access Admin
 */
router.post('/unknown-serial-ids', unknownSerialIdController.create);

/**
 * @route GET /unknown-serial-ids
 * @description Retrieve all unknown serial ID records
 * @access Admin
 */
router.get('/unknown-serial-ids', unknownSerialIdController.findAll);

/**
 * @route GET /unknown-serial-ids/:serial_id
 * @description Retrieve an unknown serial ID record by serial ID
 * @access Admin
 */
router.get('/unknown-serial-ids/:serial_id', unknownSerialIdController.findBySerialId);

/**
 * @route PUT /unknown-serial-ids/:id
 * @description Update an unknown serial ID record by ID
 * @access Admin
 */
router.put('/unknown-serial-ids/:id', unknownSerialIdController.update);

/**
 * @route DELETE /unknown-serial-ids/:id
 * @description Delete an unknown serial ID record by ID
 * @access Admin
 */
router.delete('/unknown-serial-ids/:id', unknownSerialIdController.delete);

module.exports = router;