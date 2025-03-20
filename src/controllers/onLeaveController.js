const OnLeave = require('../models/onLeave.js');

class OnLeaveController {
    /**
     * Create a new leave record.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async createLeave(req, res) {
        try {

            const exist = await OnLeave.existsForDay(req.body.employee_id);

            if(exist){
                return res.status(403).json({ error : "The employee has On Leave in that day" });
            }


            const leaveId = await OnLeave.create(req.body);
            res.status(201).json({ id: leaveId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Retrieve all leave records.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async getLeaves(req, res) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const leaves = await OnLeave.findAll({ page, limit });
            res.json(leaves);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Retrieve a leave record by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async getLeaveById(req, res) {
        try {
            const leave = await OnLeave.findById(req.params.id);
            if (leave) {
                res.json(leave);
            } else {
                res.status(404).json({ error: 'Leave record not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Update a leave record by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async updateLeave(req, res) {
        try {
            const status = await OnLeave.update(req.params.id, req.body);
            if (!status) {
                res.status(404).json({ error: 'Leave record not found' });
                return;
            }
            res.json({ message: 'Leave record updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Delete a leave record by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async deleteLeave(req, res) {
        try {
            const status = await OnLeave.delete(req.params.id);
            if (!status) {
                res.status(404).json({ error: 'Leave record not found' });
                return;
            }
            res.json({ message: 'Leave record deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = OnLeaveController;