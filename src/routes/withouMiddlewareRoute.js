const express = require('express');
const UserController = require('../controllers/userController');
const validateUser = require('../validators/userValidator');
const { handleValidationErrorsUser } = require('../middlewares/validationMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();
const userController = new UserController();


router.get('/users/:id/image', userController.getImageProfileById);


module.exports = router;
