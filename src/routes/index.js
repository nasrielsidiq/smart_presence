import express from 'express';
import IndexController from '../controllers/index.js';
import UserController from '../controllers/userController.js';

const router = express.Router();
const indexController = new IndexController();
const userController = new UserController();

export function setRoutes(app) {
    app.use('/api', router);
    
    router.get('/', indexController.home);
    router.get('/data', indexController.getData);

    // User CRUD routes
    router.post('/users', userController.createUser);
    router.get('/users', userController.getUsers);
    router.get('/users/:id', userController.getUserById);
    router.put('/users/:id', userController.updateUser);
    router.delete('/users/:id', userController.deleteUser);
}