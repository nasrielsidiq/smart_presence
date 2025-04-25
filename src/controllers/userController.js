const User = require('../models/user.js');
const bcrypt = require('bcrypt');   
const path = require('path');
const fs = require('fs');
const Employee = require('../models/employee.js');
const Division = require('../models/division.js');
const Office = require('../models/office.js');
const { error } = require('console');


class UserController {
    /**
     * Create a new user.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async createUser(req, res) {
        try {

            const employee = await Employee.findBySerialId(req.body.serial_id);
            if (!employee) {
                return res.status(404).json({ error: 'Employee serial_id not found' });
            }

            const user = await User.findBySerialId(req.body.serial_id);
            if(user){
                return res.status(403).json({ error: 'This employee has alreade have an account' });
            }

            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
            if(req.file){
                req.body.image_profile = req.file.filename;
            }else{
                req.body.image_profile = null;
            }
            const userId = await User.create(req.body);
            res.status(201).json({ id: userId });
        } catch (error) {
                if (req.file) {
                    const filePath = path.resolve(__dirname, '../uploads/users', req.file.filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Retrieve all users.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async getUsers(req, res) {
        try {

            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const id = req.user.id;
            const division = req.query.division || null;
            const key = req.query.key || null;
            const privilage = req.query.privilage || null;
    
            const users = await User.findAll({ page, limit, id, division, privilage, key });
    
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Retrieve the current user based on the JWT token.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async getCurrentUser(req, res) {
        try {
            const user = await User.findById(req.user.id);
            const employee = await Employee.findBySerialId(req.user.serial_id);
            const division = await Division.findById(employee.division_id);
            const office = await Office.findById(employee.office_id);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            res.json({user, employee, division, office});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Update the current user based on the JWT token.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async updateCurrentUser(req, res) {
        try {
            const user = {
                username: req.body.username,
                password: req.body.password || null
            };

            const status = await User.updateCurrentUser(req.user.id, user);

            if (!status) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ message: 'User updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Retrieve a user by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getImageProfileById(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (user) {
                if(user.image_profile){
                    const uploadsDir = path.resolve(__dirname, '../uploads/users');
                    res.sendFile(path.join(uploadsDir, user.image_profile));
                }else{
                    res.status(404).json({ error: 'Image not found' });
                }
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Update a user by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async updateUser(req, res) {
        try {
            
            if(req.file){
                req.body.image_profile = req.file.filename;
            }else{
                req.body.image_profile = null;
            }
            
            const status = await User.update(req.params.id, req.body);

            if (!status) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.json({ message: 'User updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateImageProfile(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            if(user.image_profile){
                const uploadsDir = path.resolve(__dirname, '../uploads/users');
                const imageDir = path.join(uploadsDir, user.image_profile);

                // 2️⃣ Hapus file dari sistem jika ada
                if (fs.existsSync(imageDir)) {
                    fs.unlinkSync(imageDir);
                }
            }

            if (req.file) {
                req.body.image_profile = req.file.filename;
            } else {
                req.body.image_profile = null;
            }
            
            const status = await User.updateImage(req.params.id, req.body.image_profile);

            res.json({ message: 'User updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Delete a user by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async deleteUser(req, res) {
        try {

            const user = await User.findById(req.params.id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            console.log(user);
            if(user.id === req.user.id){
                res.status(403).json({ error: 'You cannot delete your own account' });
                return;
            }

            if(user.image_profile){
                const uploadsDir = path.resolve(__dirname, '../uploads/users');
                const imageDir = path.join(uploadsDir, user.image_profile);
    
                // 2️⃣ Hapus file dari sistem jika ada
                if (fs.existsSync(imageDir)) {
                    fs.unlinkSync(imageDir);
                }
            }

            const status = await User.delete(req.params.id);
            if (!status) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = UserController;