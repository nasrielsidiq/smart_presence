const pool = require('../db.js');

class UnknownSerialId {
    /**
     * Create a new unknown serial ID record.
     * @param {Object} data - The data for the unknown serial ID.
     * @param {string} data.serial_id - The serial ID.
     * @param {string} data.status - The status of the serial ID (pending, accepted, rejected).
     * @param {string} data.detected_at - The timestamp when the serial ID was detected.
     * @param {string} [data.note=null] - Additional notes (optional).
     * @returns {Promise<number>} - The ID of the created record.
     */
    static async create(data) {
        const { serial_id, status, note = null } = data;
        const [result] = await pool.query(
            'INSERT INTO unknown_serial_ids (serial_id, status, note) VALUES (?, ?, ?)',
            [serial_id, status, note]
        );
        return result.insertId;
    }

    /**
     * Retrieve all unknown serial ID records.
     * @returns {Promise<Array>} - An array of unknown serial ID records.
     */
    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM unknown_serial_ids');
        return rows;
    }

    /**
     * Find an unknown serial ID record by serial ID.
     * @param {string} serial_id - The serial ID to search for.
     * @returns {Promise<Object|null>} - The record if found, otherwise null.
     */
    static async findBySerialId(serial_id) {
        const [rows] = await pool.query('SELECT * FROM unknown_serial_ids WHERE serial_id = ?', [serial_id]);
        return rows[0];
    }

    /**
     * Update an unknown serial ID record by ID.
     * @param {number} id - The ID of the record to update.
     * @param {Object} data - The updated data.
     * @param {string} [data.status] - The updated status (optional).
     * @param {string} [data.note] - The updated note (optional).
     * @returns {Promise<boolean>} - A boolean indicating whether the update was successful.
     */
    static async update(id, data) {
        const { status, note } = data;
        const [result] = await pool.query(
            'UPDATE unknown_serial_ids SET status = ?, note = ? WHERE id = ?',
            [status, note, id]
        );
        return result.affectedRows > 0;
    }

    /**
     * Delete an unknown serial ID record by ID.
     * @param {number} id - The ID of the record to delete.
     * @returns {Promise<boolean>} - A boolean indicating whether the deletion was successful.
     */
    static async delete(id) {
        const [result] = await pool.query('DELETE FROM unknown_serial_ids WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = UnknownSerialId;