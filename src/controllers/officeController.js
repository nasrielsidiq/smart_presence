const Office = require('../models/office.js');

class OfficeController {
    /**
     * Create a new office.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async createOffice(req, res) {
        try {
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
            const offices = await Office.findAll();
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

    /**
     * Update an office by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async updateOffice(req, res) {
        try {
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