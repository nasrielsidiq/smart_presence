const express = require('express');
const EmployeeController = require('../controllers/employeeController');
const validateEmployee = require('../validators/employeeValidator');
const { handleValidationErrors } = require('../middlewares/validationMiddleware');
const router = express.Router();
const employeeController = new EmployeeController();

/**
 * @route POST /employees
 * @description Create a new employee
 * @access Admin
 */
router.post('/employees', validateEmployee, handleValidationErrors, employeeController.create);

/**
 * @route GET /employees
 * @description Retrieve all employees
 * @access Admin
 */
router.get('/employees', employeeController.findAll);

/**
 * @route PUT /employees/active/:id
 * @description Update the on-leave status of an employee by ID
 * @access Admin
 */
router.put('/employees/active/:id', employeeController.updateOnLeave);

/**
 * @route GET /employees/:id
 * @description Retrieve an employee by ID
 * @access Admin
 */
router.get('/employees/:id', employeeController.findById);

/**
 * @route PUT /employees/:id
 * @description Update an employee by ID
 * @access Admin
 */
router.put('/employees/:id', validateEmployee, handleValidationErrors, employeeController.update);

/**
 * @route DELETE /employees/:id
 * @description Delete an employee by ID
 * @access Admin
 */
router.delete('/employees/:id', employeeController.delete);

module.exports = router;