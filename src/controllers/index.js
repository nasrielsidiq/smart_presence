const pool = require('../db.js');

class IndexController {
    async home(req, res) {
        res.send('Welcome to the API');
    }

    async getData(req, res) {
        try {
            const [rows] = await pool.query('SELECT * FROM your_table');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = IndexController;