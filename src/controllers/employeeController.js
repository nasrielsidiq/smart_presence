const Employee = require('../models/employee');
const User = require('../models/user');

class EmployeeController {
    /**
     * Create a new employee.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async create(req, res) {
        try {
            if (req.body.supervisor_id) {
                const user = await User.findById(req.body.supervisor_id);
                
                if (!user) {
                    return res.status(404).json({ error: 'Supervisor not found' });
                }

                if (user.privilage !== 'supervisor') {
                    return res.status(400).json({ error: 'Supervisor must have privilage supervisor' });
                }
            }
    
            const id = await Employee.create(req.body);
            return res.status(201).json({ id });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    /**
     * Retrieve all employees.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async findAll(req, res) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const employees = await Employee.findAll({ page, limit });
            res.json(employees);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Retrieve an employee by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async findById(req, res) {
        try {
            const employee = await Employee.findById(req.params.id);
            if (employee) {
                res.json(employee);
            } else {
                res.status(404).json({ error: 'Employee not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Update an employee by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async update(req, res) {
        try {
            if (req.body.supervisor_id) {
                const user = await User.findById(req.body.supervisor_id);
                
                if (!user) {
                    return res.status(404).json({ error: 'Supervisor not found' });
                }

                if (user.privilage !== 'supervisor') {
                    return res.status(400).json({ error: 'Supervisor must have privilage supervisor' });
                }
            }
            const success = await Employee.update(req.params.id, req.body);

            if (!success) {
                res.status(404).json({ error: 'Employee not found' });
                return;
            }
            res.json({ message: 'Employee updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateOnLeave(req, res) {
        try {
            const success = await Employee.updateOnLeave(req.params.id, req.body);

            if (!success) {
                res.status(404).json({ error: 'Employee not found' });
                return;
            }
            res.json({ message: 'Employee updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Delete an employee by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async delete(req, res) {
        try {

            const employee = await Employee.findById(req.params.id);
            if (!employee) {
                return res.status(404).json({ error: 'Employee not found' });
            }

            const user = await User.findBySerialId(employee.serial_id);
            if (user) {
                return res.status(403).json({ error: "Can't delete this employee because this employee have an user account" });
            }

            const success = await Employee.delete(req.params.id);
    
            if (success) {
                res.json({ message: 'Employee deleted successfully' });
            } else {
                res.status(404).json({ error: 'Employee not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = EmployeeController;