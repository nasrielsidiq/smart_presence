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
        const { username, email, password, serial_id, no_hp, privilage } = user;
        await pool.query(
            'UPDATE users SET username = ?, email = ?, password = ?, serial_id = ?, no_hp = ?, privilage = ? WHERE id = ?',
            [username, email, password, serial_id, no_hp, privilage, id]
        );
    }

    static async delete(id) {
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
    }
}

module.exports = User;