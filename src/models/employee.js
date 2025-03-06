const pool = require('../db.js');

class Employee {
    static async create(employee) {
        const { serial_id, office_id, division_id, supervisor_id, full_name, position, email, no_hp, created_at } = employee;
        const [result] = await pool.query(
            'INSERT INTO employees (serial_id, office_id, division_id, supervisor_id, full_name, position, email, no_hp, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [serial_id, office_id, division_id, supervisor_id, full_name, position, email, no_hp, created_at]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM employees');
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, employee) {
        try{
            const { serial_id, office_id, division_id, supervisor_id, full_name, position, email, no_hp, created_at } = employee;
            const [update] = await pool.query(
                'UPDATE employees SET serial_id = ?, office_id = ?, division_id = ?, supervisor_id = ?, full_name = ?, position = ?, email = ?, no_hp = ?, created_at = ? WHERE id = ?',
                [serial_id, office_id, division_id, supervisor_id, full_name, position, email, no_hp, created_at, id]
            );

            return update.affectedRows > 0; 
        }catch(error){
            console.error('Error updating employee:', error);
            throw new Error('Failed to update employee');
        }
    }

    static async delete(id) {
        try {
            const [result] = await pool.query('DELETE FROM employees WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting employee:', error);
            throw new Error('Failed to delete employee'); // ✅ Lempar error agar bisa ditangkap di controller
        }
    }
}

module.exports = Employee;