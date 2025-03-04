const express = require('express');
const IndexController = require('../controllers/index.js');
const UserController = require('../controllers/userController.js');
const OfficeController = require('../controllers/officeController.js');
const DivisionController = require('../controllers/divisionController.js');

const router = express.Router();
const indexController = new IndexController();
const userController = new UserController();
const officeController = new OfficeController();
const divisionController = new DivisionController();

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

    // Division CRUD routes
    router.post('/divisions', divisionController.createDivision);
    router.get('/divisions', divisionController.getDivisions);
    router.get('/divisions/:id', divisionController.getDivisionById);
    router.put('/divisions/:id', divisionController.updateDivision);
    router.delete('/divisions/:id', divisionController.deleteDivision);
}

module.exports = { setRoutes };