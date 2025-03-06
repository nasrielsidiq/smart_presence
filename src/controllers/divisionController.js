const Division = require('../models/division.js');

class DivisionController {
    async createDivision(req, res) {
        try {
            const divisionId = await Division.create(req.body);
            res.status(201).json({ id: divisionId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getDivisions(req, res) {
        try {
            const divisions = await Division.findAll();
            res.json(divisions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getDivisionById(req, res) {
        try {
            const division = await Division.findById(req.params.id);
            if (division) {
                res.json(division);
            } else {
                res.status(404).json({ error: 'Division not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateDivision(req, res) {
        try {

            const success = await Division.update(req.params.id, req.body);
            if(!success) {
                res.status(404).json({ error: 'Division not found' });
                return;
            }
            
            res.json({ message: 'Division updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteDivision(req, res) {
        try {
            const success = await Division.delete(req.params.id);

            if(!success) {
                res.status(404).json({ error: 'Division not found' });
                return;
            }
            res.json({ message: 'Division deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}


module.exports = DivisionController;