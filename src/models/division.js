const pool = require('../db.js');

class Division {
    static async create(division) {
        const { office_id, name } = division;
        const [result] = await pool.query(
            'INSERT INTO divisions (office_id, name) VALUES (?, ?)',
            [office_id, name]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM divisions');
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM divisions WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, division) {
        const { office_id, name } = division;
        await pool.query(
            'UPDATE divisions SET office_id = ?, name = ? WHERE id = ?',
            [office_id, name, id]
        );
    }

    static async delete(id) {
        await pool.query('DELETE FROM divisions WHERE id = ?', [id]);
    }
}

module.exports = Division;