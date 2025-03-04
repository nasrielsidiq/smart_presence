const express = require('express');
const IndexController = require('../controllers/index.js');
const UserController = require('../controllers/userController.js');
const OfficeController = require('../controllers/officeController.js');

const router = express.Router();
const indexController = new IndexController();
const userController = new UserController();
const officeController = new OfficeController();

function setRoutes(app) {
    app.use('/api', router);
    
    router.get('/', indexController.home);
    router.get('/data', indexController.getData);

    // User CRUD routes
    router.post('/users', userController.createUser);
    router.get('/users', userController.getUsers);
    router.get('/users/:id', userController.getUserById);
    router.put('/users/:id', userController.updateUser);
    router.delete('/users/:id', userController.deleteUser);

    // Office CRUD routes
    router.post('/offices', officeController.createOffice);
    router.get('/offices', officeController.getOffices);
    router.get('/offices/:id', officeController.getOfficeById);
    router.put('/offices/:id', officeController.updateOffice);
    router.delete('/offices/:id', officeController.deleteOffice);
}

module.exports = { setRoutes };