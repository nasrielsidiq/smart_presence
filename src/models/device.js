const pool = require('../db.js');

class Device {
    /**
     * Create a new device.
     * @param {Object} device - The device data.
     * @param {string} device.device_code - The unique code of the device.
     * @param {string} device.device_name - The name of the device.
     * @param {string} device.status - The status of the device (active, inactive).
     * @param {string} device.location - The location of the device.
     * @param {string} device.created_at - The creation timestamp of the device.
     * @returns {Promise<number>} - The ID of the created device.
     */
    static async create(device) {
        const { device_code, device_name, status, location, created_at } = device;
        await pool.query(
            'INSERT INTO devices (device_code, device_name, status, location, created_at) VALUES (?, ?, ?, ?, ?)',
            [device_code, device_name, status, location, created_at]
        );
        return device_code;
    }

    /**
     * Retrieve all devices.
     * @returns {Promise<Array>} - An array of device records.
     */
    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM devices');
        return rows;
    }

    /**
     * Find a device by ID.
     * @param {string} device_code - The unique code of the device.
     * @returns {Promise<Object|null>} - The device record if found, otherwise null.
     */
    static async findByCode(device_code) {
        const [rows] = await pool.query('SELECT * FROM devices WHERE device_code = ?', [device_code]);
        return rows[0];
    }

    /**
     * Update a device by code.
     * @param {string} device_code - The unique code of the device.
     * @param {Object} device - The updated device data.
     * @returns {Promise<boolean>} - A boolean indicating whether the update was successful.
     */
    static async update(device_code, device) {
        const { device_name, status, location } = device;
        const [result] = await pool.query(
            'UPDATE devices SET device_name = ?, status = ?, location = ? WHERE device_code = ?',
            [device_name, status, location, device_code]
        );
        return result.affectedRows > 0;
    }

    /**
     * Delete a device by code.
     * @param {string} device_code - The unique code of the device.
     * @returns {Promise<boolean>} - A boolean indicating whether the deletion was successful.
     */
    static async delete(device_code) {
        const [result] = await pool.query('DELETE FROM devices WHERE device_code = ?', [device_code]);
        return result.affectedRows > 0;
    }
}

module.exports = Device;