const pool = require('../db.js');

class Division {
    /**
     * Create a new division.
     * @param {Object} division - The division data.
     * @param {number} division.office_id - The office ID associated with the division.
     * @param {string} division.name - The name of the division.
     * @returns {Promise<number>} - The ID of the created division.
     */
    static async create(division) {
        const { office_id, name } = division;
        const [result] = await pool.query(
            'INSERT INTO divisions (office_id, name) VALUES (?, ?)',
            [office_id, name]
        );
        return result.insertId;
    }

    static async findByName(name){
        const [result] = await pool.query(
            'SELECT * FROM divisions WHERE name = ?',
            [name]
        );
        return result[0];
    }

    /**
     * Retrieve all divisions.
     * @returns {Promise<Array>} - An array of division records.
     */
    static async findAll({ page = 1, limit = 10 }) {
        const offset = (page - 1) * limit;
        const [rows] = await pool.query('SELECT * FROM divisions LIMIT ? OFFSET ?', [limit, offset]);
        const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM divisions');
        return {
            divisions: rows,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        }
    }

    /**
     * Find a division by ID.
     * @param {number} id - The ID of the division.
     * @returns {Promise<Object|null>} - The division record if found, otherwise null.
     */
    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM divisions WHERE id = ?', [id]);
        return rows[0];
    }

    /**
     * Update a division by ID.
     * @param {number} id - The ID of the division.
     * @param {Object} division - The updated division data.
     * @param {number} division.office_id - The office ID associated with the division.
     * @param {string} division.name - The name of the division.
     * @returns {Promise<boolean>} - A boolean indicating whether the update was successful.
     */
    static async update(id, division) {
        try {
            const { office_id, name } = division;
            const [update] = await pool.query(
                'UPDATE divisions SET office_id = ?, name = ? WHERE id = ?',
                [office_id, name, id]
            );
            return update.affectedRows > 0;
        } catch (error) {
            console.error('Error updating division:', error);
            throw new Error('Failed to update division');
        }
    }

    /**
     * Delete a division by ID.
     * @param {number} id - The ID of the division.
     * @returns {Promise<boolean>} - A boolean indicating whether the deletion was successful.
     */
    static async delete(id) {
        try {
            const [result] = await pool.query('DELETE FROM divisions WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting division:', error);
            throw new Error('Failed to delete division');
        }
    }
}

module.exports = Division;