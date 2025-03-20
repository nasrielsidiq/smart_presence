const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();
const userController = new UserController();

/**
 * Profile routes
 */
router.get('/me', userController.getCurrentUser);
router.post('/me/update', userController.updateCurrentUser);

module.exports = router;