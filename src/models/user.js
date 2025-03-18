const pool = require('../db.js');
const bcrypt = require('bcrypt');

class User {
    /**
     * Create a new user.
     * @param {Object} user - The user data.
     * @param {string} user.username - The username of the user.
     * @param {string} user.password - The password of the user.
     * @param {string} user.serial_id - The serial ID of the user.
     * @param {string} user.no_hp - The phone number of the user.
     * @param {string} user.privilage - The privilege of the user.
     * @returns {Promise<number>} - The ID of the created user.
     */
    static async create(user) {
        const { username, password, serial_id, privilage, image_profile = null } = user;
        const [result] = await pool.query(
            'INSERT INTO users (username, password, serial_id, privilage, image_profile, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
            [username, password, serial_id, privilage, image_profile]
        );
        return result.insertId;
    }

    /**
     * Retrieve all users.
     * @param {Object} options - The options for retrieving users.
     * @param {number} [options.page=1] - The page number.
     * @param {number} [options.limit=10] - The number of records per page.
     * @param {number} options.id - The ID of the user making the request.
     * @returns {Promise<Object>} - An object containing the user records, total records, total pages, and current page.
     */
    static async findAll({ page = 1, limit = 10, id, division = null}) {
        const offset = (page - 1) * limit;
        let divisionFilter = '';

        if(division){
            divisionFilter = `AND d.id = ${division}`;
        }

        const [rows] = await pool.query(`
            SELECT u.id, username, e.email, e.serial_id, privilage, 
            image_profile, d.name AS division_name, u.created_at 
            FROM users u 
            INNER JOIN employees e ON u.serial_id = e.serial_id 
            INNER JOIN divisions d ON e.division_id = d.id 
            WHERE u.id != ?
            ${divisionFilter}
            LIMIT ? OFFSET ?`
            , [id, limit, offset]);
        const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM users u INNER JOIN employees e ON u.serial_id = e.serial_id INNER JOIN divisions d ON e.division_id = d.id WHERE u.id != ? LIMIT ? OFFSET ?', [id, limit, offset]);
        return {
            users: rows,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }

    /**
     * Find a user by ID.
     * @param {number} id - The ID of the user.
     * @returns {Promise<Object|null>} - The user record if found, otherwise null.
     */
    static async findById(id) {
        const [rows] = await pool.query('SELECT id, username, serial_id, privilage, image_profile, created_at FROM users WHERE id = ?', [id]);
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
     * Find a user by serial ID.
     * @param {string} serial_id - The serial ID of the user.
     * @returns {Promise<Object|null>} - The user record if found, otherwise null.
     */
    static async findBySerialId(serial_id) {
        const [rows] = await pool.query('SELECT * FROM users WHERE serial_id = ?', [serial_id]);
        return rows[0];
    }

    /**
     * Update a user by ID.
     * @param {number} id - The ID of the user.
     * @param {Object} user - The updated user data.
     * @param {string} user.username - The username of the user.
     * @param {string} user.password - The password of the user.
     * @param {string} user.serial_id - The serial ID of the user.
     * @param {string} user.no_hp - The phone number of the user.
     * @param {string} user.privilage - The privilege of the user.
     * @returns {Promise<boolean>} - A boolean indicating whether the update was successful.
     */
    static async update(id, user) {
        try {
            const { username, password, privilage, image_profile } = user;
            console.log(user);
            // Retrieve old password if no new password is provided
            const [rows] = await pool.query('SELECT password, image_profile FROM users WHERE id = ?', [id]);
            if (rows.length === 0) {
                throw new Error('User not found');
            }
    
            // Hash new password if provided
            let newPassword = rows[0].password;
            if (password) {
                newPassword = await bcrypt.hash(password, 10);
            }
            
            let newImage = rows[0].image_profile;
            if (image_profile) {
                newImage = image_profile;
            }

            console.log(rows);

            const [status] = await pool.query(
                'UPDATE users SET username = ?, password = ?, privilage = ?, image_profile = ? WHERE id = ?',
                [username, newPassword, privilage, newImage, id]
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
     * @param {string} [user.password] - The new password of the user (optional).
     * @param {string} user.no_hp - The phone number of the user.
     * @returns {Promise<boolean>} - A boolean indicating whether the update was successful.
     */
    static async updateCurrentUser(id, user) {
        try {
            let { username, password } = user;
    
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
                'UPDATE users SET username = ?, password = ? WHERE id = ?',
                [username, newPassword, id]
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