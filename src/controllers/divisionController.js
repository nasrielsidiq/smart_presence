const Division = require('../models/division.js');

class DivisionController {
    /**
     * Create a new division.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async createDivision(req, res) {
        try {

            const division = await Division.findByName(req.body.name);
            if(division) {
                if(division.office_id == req.body.office_id){
                    return res.status(403).json({ error : `Can't create same division at the same office` });
                }
            }

            // console.log(division);

            const divisionId = await Division.create(req.body);
            res.status(201).json({ id: divisionId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Retrieve all divisions.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async getDivisions(req, res) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const key = req.query.key || null;
            const office = req.query.office || null;
            const divisions = await Division.findAll({ page, limit, office, key });
            res.json(divisions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Retrieve a division by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
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

    /**
     * Update a division by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async updateDivision(req, res) {
        try {
            const success = await Division.update(req.params.id, req.body);
            if (!success) {
                res.status(404).json({ error: 'Division not found' });
                return;
            }
            res.json({ message: 'Division updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Delete a division by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async deleteDivision(req, res) {
        try {

            
            const employees = await Division.findByDivisionId(req.params.id);
            if (employees) {
                return res.status(403).json({ error: 'Division has employees, cannot delete' });
            }

            const success = await Division.delete(req.params.id);
            if (!success) {
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