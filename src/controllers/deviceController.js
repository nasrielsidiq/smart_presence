const Device = require('../models/device');

class DeviceController {
    /**
     * Create a new device.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async createDevice(req, res) {
        try {
            const deviceId = await Device.create(req.body);
            res.status(201).json({ id: deviceId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Retrieve all devices.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async getDevices(req, res) {
        try {
            const devices = await Device.findAll();
            res.json(devices);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Retrieve a device by code.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async getDeviceByCode(req, res) {
        try {
            const device = await Device.findByCode(req.params.device_code);
            if (device) {
                res.json(device);
            } else {
                res.status(404).json({ error: 'Device not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Update a device by code.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async updateDevice(req, res) {
        try {
            const success = await Device.update(req.params.device_code, req.body);
            if (!success) {
                res.status(404).json({ error: 'Device not found' });
                return;
            }
            res.json({ message: 'Device updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Delete a device by code.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async deleteDevice(req, res) {
        try {
            const success = await Device.delete(req.params.device_code);
            if (!success) {
                res.status(404).json({ error: 'Device not found' });
                return;
            }
            res.json({ message: 'Device deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = DeviceController;