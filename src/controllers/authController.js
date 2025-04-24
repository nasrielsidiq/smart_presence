const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
    /**
     * Handle user login.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findByUsername(username);
            console.log(user);

            if (!user) {
                return res.status(404).json({ error: 'Wrong username or password' });
            }
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Wrong username or password' });
            }

            // const privilage = user.privilage;
            const token = jwt.sign({ id: user.id, privilege: user.privilage, serial_id: user.serial_id }, 'your_jwt_secret', { expiresIn: '7d' });
        
            res.json({ token, user: { id: user.id, username: user.username, privilege: user.privilage, serial_id: user.serial_id } });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Handle user logout.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async logout(req, res) {
        // For stateless JWT, logout can be handled on the client side by deleting the token
        res.json({ message: 'Logged out successfully' });
    }
}

module.exports = AuthController;