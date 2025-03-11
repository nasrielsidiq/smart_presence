const pool = require('../db.js');
const bcrypt = require('bcrypt');

class User {
    /**
     * Create a new user.
     * @param {Object} user - The user data.
     * @param {string} user.username - The username of the user.
     * @param {string} user.email - The email of the user.
     * @param {string} user.password - The password of the user.
     * @param {string} user.serial_id - The serial ID of the user.
     * @param {string} user.no_hp - The phone number of the user.
     * @param {string} user.privilage - The privilege of the user.
     * @returns {Promise<number>} - The ID of the created user.
     */
    static async create(user) {
        const { username, email, password, serial_id, no_hp, privilage } = user;
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password, serial_id, no_hp, privilage, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            [username, email, password, serial_id, no_hp, privilage]
        );
        return result.insertId;
    }

    /**
     * Retrieve all users.
     * @returns {Promise<Array>} - An array of user records.
     */
    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM users');
        return rows; 
    }

    /**
     * Find a user by ID.
     * @param {number} id - The ID of the user.
     * @returns {Promise<Object|null>} - The user record if found, otherwise null.
     */
    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    /**
     * Find a user by username.
     * @param {string} username - The username of the user.
     * @returns {Promise<Object|null>} - The user record if found, otherwise null.
     */
    static async findByUsername(username) {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    }

    /**
     * Update a user by ID.
     * @param {number} id - The ID of the user.
     * @param {Object} user - The updated user data.
     * @param {string} user.username - The username of the user.
     * @param {string} user.email - The email of the user.
     * @param {string} user.password - The password of the user.
     * @param {string} user.serial_id - The serial ID of the user.
     * @param {string} user.no_hp - The phone number of the user.
     * @param {string} user.privilage - The privilege of the user.
     * @returns {Promise<boolean>} - A boolean indicating whether the update was successful.
     */
    static async update(id, user) {
        try {
            const { username, email, password, serial_id, no_hp, privilage } = user;
            const [status] = await pool.query(
                'UPDATE users SET username = ?, email = ?, password = ?, serial_id = ?, no_hp = ?, privilage = ? WHERE id = ?',
                [username, email, password, serial_id, no_hp, privilage, id]
            );

            return status.affectedRows > 0;
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Failed to update user');
        }   
    }

    /**
     * Update the current user.
     * @param {number} id - The ID of the user.
     * @param {Object} user - The updated user data.
     * @param {string} user.username - The username of the user.
     * @param {string} user.email - The email of the user.
     * @param {string} [user.password] - The new password of the user (optional).
     * @param {string} user.no_hp - The phone number of the user.
     * @returns {Promise<boolean>} - A boolean indicating whether the update was successful.
     */
    static async updateCurrentUser(id, user) {
        try {
            let { username, email, password, no_hp } = user;
    
            // Retrieve old password if no new password is provided
            const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [id]);
            if (rows.length === 0) {
                throw new Error('User not found');
            }
    
            // Hash new password if provided
            let newPassword = rows[0].password;
            if (password) {
                newPassword = await bcrypt.hash(password, 10);
            }
    
            // Perform update
            const [status] = await pool.query(
                'UPDATE users SET username = ?, email = ?, password = ?, no_hp = ? WHERE id = ?',
                [username, email, newPassword, no_hp, id]
            );
    
            return status.affectedRows > 0;
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Failed to update user');
        }
    }

    /**
     * Delete a user by ID.
     * @param {number} id - The ID of the user.
     * @returns {Promise<boolean>} - A boolean indicating whether the deletion was successful.
     */
    static async delete(id) {
        try {
            const [status] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
            return status.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw new Error('Failed to delete user');
        }
    }
}

module.exports = User;