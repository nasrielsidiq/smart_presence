const pool = require('../db.js');

class User {
    static async create(user) {
        const { username, email, password, serial_id, no_hp, privilage } = user;
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password, serial_id, no_hp, privilage, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            [username, email, password, serial_id, no_hp, privilage]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM users');
        return rows; 
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, user) {
        try{
            const { username, email, password, serial_id, no_hp, privilage } = user;
            const [status] = await pool.query(
                'UPDATE users SET username = ?, email = ?, password = ?, serial_id = ?, no_hp = ?, privilage = ? WHERE id = ?',
                [username, email, password, serial_id, no_hp, privilage, id]
            );

            return status.affectedRows > 0;
        }catch(error){
            console.error('Error updating user:', error);
            throw new Error('Failed to update user');
        }   
    }

    static async delete(id) {
        try{
            const [status] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
            return status.affectedRows > 0;
        }catch (error){
            console.error('Error deleting user:', error);
            throw new Error('Failed to delete user');
        }
        
    }
}

module.exports = User;