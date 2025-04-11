const express = require('express');
const DeviceController = require('../controllers/deviceController');
const router = express.Router();
const deviceController = new DeviceController();

/**
 * @route POST /devices
 * @description Create a new device
 * @access Admin
 */
router.post('/devices', deviceController.createDevice);

/**
 * @route GET /devices
 * @description Retrieve all devices
 * @access Admin
 */
router.get('/devices', deviceController.getDevices);

/**
 * @route GET /devices/:device_code
 * @description Retrieve a device by code
 * @access Admin
 */
router.get('/devices/:device_code', deviceController.getDeviceByCode);

/**
 * @route PUT /devices/:device_code
 * @description Update a device by code
 * @access Admin
 */
router.put('/devices/:device_code', deviceController.updateDevice);

/**
 * @route DELETE /devices/:device_code
 * @description Delete a device by code
 * @access Admin
 */
router.delete('/devices/:device_code', deviceController.deleteDevice);

module.exports = router;