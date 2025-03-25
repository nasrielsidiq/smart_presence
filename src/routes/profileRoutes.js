const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();
const userController = new UserController();

/**
 * @route GET /me
 * @description Retrieve the current user based on the JWT token
 * @access Authenticated User
 */
router.get('/me', userController.getCurrentUser);

/**
 * @route POST /me/update
 * @description Update the current user based on the JWT token
 * @access Authenticated User
 */
router.post('/me/update', userController.updateCurrentUser);

module.exports = router;