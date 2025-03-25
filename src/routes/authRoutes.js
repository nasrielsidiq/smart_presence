const express = require('express');
const AuthController = require('../controllers/authController');
const router = express.Router();
const authController = new AuthController();

/**
 * @route POST /login
 * @description Log in a user
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route GET /logout
 * @description Log out a user
 * @access Authenticated User
 */
router.get('/logout', authController.logout);

module.exports = router;