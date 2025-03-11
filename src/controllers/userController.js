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
            const filteredUsers = users.map(user => ({
                id: user.id,
                username: user.username,
                email: user.email,
                privilage: user.privilage,
                no_hp: user.no_hp,
                createdAt: user.createdAt,
            }));
    
            res.json(filteredUsers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Retrieve the current user based on the JWT token.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async getCurrentUser(req, res) {
        try {
            const user = await User.findById(req.user.id);
    
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Update the current user based on the JWT token.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async updateCurrentUser(req, res) {
        try {
            const user = {
                username: req.body.username,
                email: req.body.email,
                no_hp: req.body.no_hp,
                password: req.body.password || null
            };

            const status = await User.updateCurrentUser(req.user.id, user);

            if (!status) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ message: 'User updated successfully' });
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