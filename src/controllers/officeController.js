const Office = require('../models/office.js');
const Division = require('../models/division.js');
const path = require('path');
const fs = require('fs');

class OfficeController {
    /**
     * Create a new office.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async createOffice(req, res) {
        try {
            if(req.file){
                req.body.img_office = req.file.filename;
            }else{
                req.body.img_office = null;
            }
            const officeId = await Office.create(req.body);
            res.status(201).json({ id: officeId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Retrieve all offices.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async getOffices(req, res) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const key = req.query.key || null;
            const offices = await Office.findAll({ page, limit, key });
            res.json(offices);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Retrieve an office by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async getOfficeById(req, res) {
        try {
            const office = await Office.findById(req.params.id);
            if (office) {
                res.json(office);
            } else {
                res.status(404).json({ error: 'Office not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getImageOfficeById(req, res) {
        try {
            const office = await Office.findById(req.params.id);
            if (office) {
                if(office.img_office){
                    const uploadsDir = path.resolve(__dirname, '../uploads/offices');
                    res.sendFile(path.join(uploadsDir, office.img_office));
                }else{
                    res.status(404).json({ error: 'Image not found' });
                }
            } else {
                res.status(404).json({ error: 'Office not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Update an office by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async updateOffice(req, res) {
        try {

            if(req.file){
                req.body.img_office = req.file.filename;
            }else{
                req.body.img_office = null;
            }

            const status = await Office.update(req.params.id, req.body);

            if (!status) {
                res.status(404).json({ error: 'Office not found' });
                return;
            }
            res.json({ message: 'Office updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Delete an office by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async deleteOffice(req, res) {
        try {

            // Check if the office is associated with any divisions before deleting
            const office = await Office.findById(req.params.id);
            if (!office) {
                res.status(404).json({ error: 'Office not found' });
                return;
            }
            const divisions = await Division.findByOfficeId(req.params.id);
            if (divisions) {
                res.status(400).json({ error: 'Cannot delete office with associated divisions' });
                return;
            }

            if(office.img_office){
                const uploadsDir = path.resolve(__dirname, '../uploads/offices');
                const filePath = path.join(uploadsDir, office.img_office);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath); // Delete the file from the server
                }
            }

            const status = await Office.delete(req.params.id);

            if (!status) {
                res.status(404).json({ error: 'Office not found' });
                return;
            }
            res.json({ message: 'Office deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = OfficeController;