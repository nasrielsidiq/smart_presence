const User = require('../models/user.js');
const bcrypt = require('bcrypt');   

class UserController {
    /**
     * Create a new user.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async createUser(req, res) {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
            const userId = await User.create(req.body);
            res.status(201).json({ id: userId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Retrieve all users.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async getUsers(req, res) {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Retrieve a user by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Update a user by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async updateUser(req, res) {
        try {
            const status = await User.update(req.params.id, req.body);

            if (!status) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.json({ message: 'User updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Delete a user by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async deleteUser(req, res) {
        try {
            const status = await User.delete(req.params.id);
            if (!status) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = UserController;