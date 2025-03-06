const Employee = require('../models/employee');
const User = require('../models/user');

const user = new User();

class EmployeeController {
    async create(req, res) {
        try {
            if (req.body.supervisor_id) {
                const user = await User.findById(req.body.supervisor_id);
                
                if (!user) { // ✅ Pastikan supervisor ditemukan
                    return res.status(404).json({ error: 'Supervisor not found' });
                }

                if (user.privilage !== 'supervisor') { // ✅ Pastikan supervisor memiliki privilage 'supervisor'
                    return res.status(400).json({ error: 'Supervisor must have privilage supervisor' });
                }
            }
    
            const id = await Employee.create(req.body);
            return res.status(201).json({ id });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async findAll(req, res) {
        try {
            const employees = await Employee.findAll();
            res.json(employees);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

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

    async update(req, res) {
        try {
            if (req.body.supervisor_id) {
                const user = await User.findById(req.body.supervisor_id);
                
                if (!user) { // ✅ Pastikan supervisor ditemukan
                    return res.status(404).json({ error: 'Supervisor not found' });
                }

                if (user.privilage !== 'supervisor') { // ✅ Pastikan supervisor memiliki privilage 'supervisor'
                    return res.status(400).json({ error: 'Supervisor must have privilage supervisor' });
                }
            }
            const success =  await Employee.update(req.params.id, req.body);

            if(!success) {
                res.status(404).json({ error: 'Employee not found' });
                return;
            }
            res.json({ message: 'Employee updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const success = await Employee.delete(req.params.id);
    
            if (success) {
                res.json({ message: 'Employee deleted successfully' });
            } else {
                res.status(404).json({ error: 'Employee not found' }); // ✅ 404 jika ID tidak ditemukan
            }
        } catch (error) {
            res.status(500).json({ error: error.message }); // ✅ 500 jika ada error lainnya
        }
    }
}   

module.exports = EmployeeController;