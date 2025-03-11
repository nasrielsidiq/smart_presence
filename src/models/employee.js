const pool = require('../db.js');

class Employee {
    /**
     * Create a new employee.
     * @param {Object} employee - The employee data.
     * @param {string} employee.serial_id - The serial ID of the employee.
     * @param {number} employee.office_id - The office ID of the employee.
     * @param {number} employee.division_id - The division ID of the employee.
     * @param {number} employee.supervisor_id - The supervisor ID of the employee.
     * @param {string} employee.full_name - The full name of the employee.
     * @param {string} employee.position - The position of the employee.
     * @param {string} employee.email - The email of the employee.
     * @param {string} employee.no_hp - The phone number of the employee.
     * @param {string} employee.created_at - The creation timestamp of the employee.
     * @returns {Promise<number>} - The ID of the created employee.
     */
    static async create(employee) {
        const { serial_id, office_id, division_id, supervisor_id, full_name, position, email, no_hp, created_at } = employee;
        const [result] = await pool.query(
            'INSERT INTO employees (serial_id, office_id, division_id, supervisor_id, full_name, position, email, no_hp, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [serial_id, office_id, division_id, supervisor_id, full_name, position, email, no_hp, created_at]
        );
        return result.insertId;
    }

    /**
     * Retrieve all employees.
     * @returns {Promise<Array>} - An array of employee records.
     */
    static async findAll({ page = 1, limit = 10 }) {
        const offset = (page - 1) * limit;
        const [rows] = await pool.query('SELECT * FROM employees LIMIT ? OFFSET ?', [limit, offset]);
        const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM employees');
        return {
            employees: rows,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }


    static async svFindAll({ page = 1, limit = 10 }) {
        const offset = (page - 1) * limit;
        const supervisor_id = req.user.id;
        const [rows] = await pool.query('SELECT * FROM employees WHERE supervisor_id = ? LIMIT ? OFFSET ?', [supervisor_id, limit, offset]);
        const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM employees');
        return {
            employees: rows,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }

    /**
     * Find an employee by ID.
     * @param {number} id - The ID of the employee.
     * @returns {Promise<Object|null>} - The employee record if found, otherwise null.
     */
    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
        return rows[0];
    }

    /**
     * Find an employee by serial ID.
     * @param {string} serial_id - The serial ID of the employee.
     * @returns {Promise<Object|null>} - The employee record if found, otherwise null.
     */
    static async findBySerialId(serial_id) {
        const [rows] = await pool.query('SELECT * FROM employees WHERE serial_id = ?', [serial_id]);
        return rows[0];
    }

    /**
     * Update an employee by ID.
     * @param {number} id - The ID of the employee.
     * @param {Object} employee - The updated employee data.
     * @param {string} employee.serial_id - The serial ID of the employee.
     * @param {number} employee.office_id - The office ID of the employee.
     * @param {number} employee.division_id - The division ID of the employee.
     * @param {number} employee.supervisor_id - The supervisor ID of the employee.
     * @param {string} employee.full_name - The full name of the employee.
     * @param {string} employee.position - The position of the employee.
     * @param {string} employee.email - The email of the employee.
     * @param {string} employee.no_hp - The phone number of the employee.
     * @param {string} employee.created_at - The creation timestamp of the employee.
     * @returns {Promise<boolean>} - A boolean indicating whether the update was successful.
     */
    static async update(id, employee) {
        try {
            const { serial_id, office_id, division_id, supervisor_id, full_name, position, email, no_hp, created_at } = employee;
            const [update] = await pool.query(
                'UPDATE employees SET serial_id = ?, office_id = ?, division_id = ?, supervisor_id = ?, full_name = ?, position = ?, email = ?, no_hp = ?, created_at = ? WHERE id = ?',
                [serial_id, office_id, division_id, supervisor_id, full_name, position, email, no_hp, created_at, id]
            );

            return update.affectedRows > 0; 
        } catch (error) {
            console.error('Error updating employee:', error);
            throw new Error('Failed to update employee');
        }
    }

    /**
     * Delete an employee by ID.
     * @param {number} id - The ID of the employee.
     * @returns {Promise<boolean>} - A boolean indicating whether the deletion was successful.
     */
    static async delete(id) {
        try {
            const [result] = await pool.query('DELETE FROM employees WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting employee:', error);
            throw new Error('Failed to delete employee');
        }
    }

    /**
     * Get the total number of employees.
     * @returns {Promise<number>} - The total number of employees.
     */
    static async totalEmployee() {
        const [rows] = await pool.query('SELECT COUNT(*) as total FROM employees');
        return rows[0].total;
    }
}

module.exports = Employee;