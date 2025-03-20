const pool = require('../db.js');

class OnLeave {
    /**
     * Create a new leave record.
     * @param {Object} leave - The leave data.
     * @param {number} leave.employee_id - The ID of the employee.
     * @param {string} leave.start_date - The start date of the leave.
     * @param {string} leave.end_date - The end date of the leave.
     * @param {string} leave.leave_type - The type of leave (annual, sick, maternity, other).
     * @param {string} leave.reason - The reason for the leave.
     * @param {string} leave.created_at - The creation timestamp of the leave.
     * @returns {Promise<number>} - The ID of the created leave record.
     */
    static async create(leave) {
        const { employee_id, start_date, end_date, leave_type, reason, created_at } = leave;
        const [result] = await pool.query(
            'INSERT INTO on_leave (employee_id, start_date, end_date, leave_type, reason, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            [employee_id, start_date, end_date, leave_type, reason, created_at]
        );
        return result.insertId;
    }

    /**
     * Retrieve all leave records.
     * @param {Object} options - The options for retrieving leave records.
     * @param {number} [options.page=1] - The page number.
     * @param {number} [options.limit=10] - The number of records per page.
     * @returns {Promise<Object>} - An object containing the leave records, total records, total pages, and current page.
     */
    static async findAll({ page = 1, limit = 10 }) {
        const offset = (page - 1) * limit;
        const [rows] = await pool.query('SELECT * FROM on_leave LIMIT ? OFFSET ?', [limit, offset]);
        const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM on_leave');
        return {
            leaves: rows,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }

    /**
     * Find a leave record by ID.
     * @param {number} id - The ID of the leave record.
     * @returns {Promise<Object|null>} - The leave record if found, otherwise null.
     */
    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM on_leave WHERE id = ?', [id]);
        return rows[0];
    }

    static async existsForDay(employee_id) {
        const [rows] = await pool.query(
            'SELECT * FROM on_leave WHERE employee_id = ? AND DATE(NOW()) BETWEEN DATE(start_date) AND DATE(end_date)',
            [employee_id]
        );
        return rows[0];
    }

    /**
     * Update a leave record by ID.
     * @param {number} id - The ID of the leave record.
     * @param {Object} leave - The updated leave data.
     * @param {number} leave.employee_id - The ID of the employee.
     * @param {string} leave.start_date - The start date of the leave.
     * @param {string} leave.end_date - The end date of the leave.
     * @param {string} leave.leave_type - The type of leave (annual, sick, maternity, other).
     * @param {string} leave.reason - The reason for the leave.
     * @param {string} leave.created_at - The creation timestamp of the leave.
     * @returns {Promise<boolean>} - A boolean indicating whether the update was successful.
     */
    static async update(id, leave) {
        const { employee_id, start_date, end_date, leave_type, reason, created_at } = leave;
        const [result] = await pool.query(
            'UPDATE on_leave SET employee_id = ?, start_date = ?, end_date = ?, leave_type = ?, reason = ?, created_at = ? WHERE id = ?',
            [employee_id, start_date, end_date, leave_type, reason, created_at, id]
        );
        return result.affectedRows > 0;
    }

    /**
     * Delete a leave record by ID.
     * @param {number} id - The ID of the leave record.
     * @returns {Promise<boolean>} - A boolean indicating whether the deletion was successful.
     */
    static async delete(id) {
        const [result] = await pool.query('DELETE FROM on_leave WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = OnLeave;