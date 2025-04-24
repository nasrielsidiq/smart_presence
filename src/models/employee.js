const pool = require('../db.js');

class Employee {
    /**
     * Create a new employee.
     * @param {Object} employee - The employee data.
     * @param {string} employee.serial_id - The serial ID of the employee.
     * @param {number} employee.office_id - The office ID of the employee.
     * @param {number} [employee.division_id=null] - The division ID of the employee (optional).
     * @param {number} employee.supervisor_id - The supervisor ID of the employee.
     * @param {string} employee.full_name - The full name of the employee.
     * @param {string} employee.position - The position of the employee.
     * @param {string} employee.email - The email of the employee.
     * @param {string} employee.no_hp - The phone number of the employee.
     * @param {string} employee.created_at - The creation timestamp of the employee.
     * @returns {Promise<number>} - The ID of the created employee.
     */
    static async create(employee) {
        const { serial_id, office_id, supervisor_id, full_name, position, email, no_hp, created_at } = employee;
        const division_id = employee.division_id || null; // Set division_id to null if not provided
        
        const [result] = await pool.query(
            'INSERT INTO employees (serial_id, office_id, division_id, supervisor_id, full_name, position, email, no_hp, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [serial_id, office_id, division_id, supervisor_id, full_name, position, email, no_hp, created_at]
        );
        return result.insertId;
    }

    /**
     * Retrieve all employees.
     * @param {Object} options - The options for retrieving employees.
     * @param {number} [options.page=1] - The page number.
     * @param {number} [options.limit=10] - The number of records per page.
     * @param {number} [options.division=null] - The division ID for filtering employees (optional).
     * @param {number} [options.office=null] - The office ID for filtering employees (optional).
     * @returns {Promise<Object>} - An object containing the employee records, total records, total pages, and current page.
     */
    static async findAll({ page = 1, limit = 10, division = null, office = null, key = null } = {}) {
        const offset = (page - 1) * limit;
        const keyFilterParams = [];
        const conditions = [];
    
        // Filter division
        if (division) {
            conditions.push(`d.id = ${division}`);
        }
    
        // Filter office
        if (office) {
            conditions.push(`o.id = ${office}`);
        }
    
        // Filter key
        if (key) {
            conditions.push(`(e.full_name LIKE ? OR o.name LIKE ?)`);
            const keyQuery = `%${key}%`;
            keyFilterParams.push(keyQuery, keyQuery);
        }
    
        // Bangun WHERE clause
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
        // Query data
        const [rows] = await pool.query(`
            SELECT 
                e.id, e.full_name, d.name AS division_name, 
                o.name AS office_name, o.city AS office_city, 
                o.address AS office_address, e.serial_id  
            FROM employees e 
            INNER JOIN offices o ON e.office_id = o.id 
            LEFT JOIN divisions d ON e.division_id = d.id 
            ${whereClause}
            LIMIT ? OFFSET ?
        `, [...keyFilterParams, limit, offset]);
    
        // Query total
        const [[{ total }]] = await pool.query(`
            SELECT COUNT(*) AS total
            FROM employees e 
            INNER JOIN offices o ON e.office_id = o.id 
            LEFT JOIN divisions d ON e.division_id = d.id 
            ${whereClause}
        `, keyFilterParams);
    
        return {
            employees: rows,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }
    

    /**
     * Retrieve all employees under a specific supervisor.
     * @param {Object} options - The options for retrieving employees.
     * @param {number} [options.page=1] - The page number.
     * @param {number} [options.limit=10] - The number of records per page.
     * @param {number} supervisor_id - The ID of the supervisor.
     * @returns {Promise<Object>} - An object containing the employee records, total records, total pages, and current page.
     */
    static async svFindAll({ page = 1, limit = 10, supervisor_id }) {
        const offset = (page - 1) * limit;
        const [rows] = await pool.query(
            'SELECT * FROM employees WHERE supervisor_id = ? LIMIT ? OFFSET ?',
            [supervisor_id, limit, offset]
        );
        const [[{ total }]] = await pool.query(
            'SELECT COUNT(*) AS total FROM employees WHERE supervisor_id = ?',
            [supervisor_id]
        );
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
     * Find employees by division ID.
     * @param {number} division_id - The division ID.
     * @returns {Promise<Array>} - An array of employee records.
     */
    static async findByDivisionId(division_id) {
        const [rows] = await pool.query('SELECT * FROM employees WHERE division_id = ?', [division_id]);
        return rows;
    }

    /**
     * Update an employee by ID.
     * @param {number} id - The ID of the employee.
     * @param {Object} employee - The updated employee data.
     * @param {string} [employee.serial_id] - The serial ID of the employee (optional).
     * @param {number} [employee.office_id] - The office ID of the employee (optional).
     * @param {number} [employee.division_id] - The division ID of the employee (optional).
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
            const { supervisor_id, full_name, position, email, no_hp, created_at } = employee;
            let serial_query = '';
            let office_query = '';
            let division_query = '';

            if (employee.serial_id) {
                serial_query = `serial_id = "${employee.serial_id}",`;
            }
            if (employee.office_id) {
                office_query = `office_id = ${employee.office_id},`;
            }
            if (employee.division_id) {
                division_query = `division_id = ${employee.division_id},`;
            }

            const [update] = await pool.query(
                `UPDATE employees SET ${serial_query} ${office_query} ${division_query} supervisor_id = ?, full_name = ?, position = ?, email = ?, no_hp = ?, created_at = ? WHERE id = ?`,
                [supervisor_id, full_name, position, email, no_hp, created_at, id]
            );

            return update.affectedRows > 0;
        } catch (error) {
            console.error('Error updating employee:', error);
            throw new Error('Failed to update employee');
        }
    }

    /**
     * Update the on-leave status of an employee by ID.
     * @param {number} id - The ID of the employee.
     * @param {Object} employee - The updated employee data.
     * @param {boolean} employee.is_active - The on-leave status of the employee.
     * @returns {Promise<boolean>} - A boolean indicating whether the update was successful.
     */
    static async updateOnLeave(id, employee) {
        try {
            const { is_active } = employee;
            const [update] = await pool.query(
                'UPDATE employees SET is_active = ? WHERE id = ?',
                [is_active, id]
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
    static async totalEmployee(division_id = null) {
        const [rows] = await pool.query('SELECT COUNT(*) as total FROM employees');
        if(division_id) {
            const [rows] = await pool.query('SELECT COUNT(*) as total FROM employees WHERE division_id = ?', [division_id]);
        }
        return rows[0].total;
    }

    /**
     * Get the total number of employees on leave.
     * @returns {Promise<number>} - The total number of employees on leave.
     */
    static async totalOnLeave() {
        const [rows] = await pool.query('SELECT COUNT(*) as total FROM employees WHERE is_active = "on_leave"');
        return rows[0].total;
    }
}

module.exports = Employee;