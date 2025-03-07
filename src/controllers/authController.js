const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findByUsername(username);
            console.log(user);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async logout(req, res) {
        // For stateless JWT, logout can be handled on the client side by deleting the token
        res.json({ message: 'Logged out successfully' });
    }
}

module.exports = AuthController;