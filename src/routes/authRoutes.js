const express = require('express');
const AuthController = require('../controllers/authController');
const router = express.Router();
const authController = new AuthController();

/**
 * Auth routes
 */
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;