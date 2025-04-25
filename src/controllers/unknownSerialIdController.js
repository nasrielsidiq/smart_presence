const UnknownSerialId = require('../models/unknownSerialId');

class UnknownSerialIdController {
    /**
     * Create a new unknown serial ID record.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async create(req, res) {
        try {
            const id = await UnknownSerialId.create(req.body);
            res.status(201).json({ id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Retrieve all unknown serial ID records.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async findAll(req, res) {
        try {
            const records = await UnknownSerialId.findAll();
            res.json(records);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Find an unknown serial ID record by serial ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async findBySerialId(req, res) {
        try {
            const record = await UnknownSerialId.findBySerialId(req.params.serial_id);
            if (!record) {
                return res.status(404).json({ error: 'Record not found' });
            }
            res.json(record);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Update an unknown serial ID record by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async update(req, res) {
        try {
            const success = await UnknownSerialId.update(req.params.id, req.body);
            if (!success) {
                return res.status(404).json({ error: 'Record not found' });
            }
            res.json({ message: 'Record updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Delete an unknown serial ID record by ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async delete(req, res) {
        try {
            const success = await UnknownSerialId.delete(req.params.id);
            if (!success) {
                return res.status(404).json({ error: 'Record not found' });
            }
            res.json({ message: 'Record deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = UnknownSerialIdController;