const Office = require('../models/office.js');

class OfficeController {
    async createOffice(req, res) {
        try {
            const officeId = await Office.create(req.body);
            res.status(201).json({ id: officeId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getOffices(req, res) {
        try {
            const offices = await Office.findAll();
            res.json(offices);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

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

    async updateOffice(req, res) {
        try {
            await Office.update(req.params.id, req.body);
            res.json({ message: 'Office updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteOffice(req, res) {
        try {
            await Office.delete(req.params.id);
            res.json({ message: 'Office deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = OfficeController;