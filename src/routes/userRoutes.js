const express = require('express');
const UserController = require('../controllers/userController');
const validateUser = require('../validators/userValidator');
const { handleValidationErrorsUser } = require('../middlewares/validationMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();
const userController = new UserController();

/**
 * @route POST /users
 * @description Create a new user
 * @access Admin
 */
router.post('/users', upload.single('image_profile'), validateUser, handleValidationErrorsUser, userController.createUser);

/**
 * @route GET /users
 * @description Retrieve all users
 * @access Admin
 */
router.get('/users', userController.getUsers);

/**
 * @route GET /users/:id/image
 * @description Retrieve the profile image of a user by ID
 * @access Admin
 */
// router.get('/users/:id/image', userController.getImageProfileById);

/**
 * @route GET /users/:id
 * @description Retrieve a user by ID
 * @access Admin
 */
router.get('/users/:id', userController.getUserById);

/**
 * @route PUT /users/:id
 * @description Update a user by ID
 * @access Admin
 */
router.put('/users/:id', upload.single('image_profile'), validateUser, handleValidationErrorsUser, userController.updateUser);

/**
 * @route DELETE /users/:id
 * @description Delete a user by ID
 * @access Admin
 */
router.delete('/users/:id', userController.deleteUser);

module.exports = router;