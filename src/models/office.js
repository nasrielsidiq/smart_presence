const pool = require('../db.js');

class Office {
    static async create(office) {
        const { name, city, address } = office;
        const [result] = await pool.query(
            'INSERT INTO offices (name, city, address) VALUES (?, ?, ?)',
            [name, city, address]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM offices');
        return rows;
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM offices WHERE id = ?', [id]);
        return rows[0];
    }

    static async update(id, office) {
        const { name, city, address } = office;
        await pool.query(
            'UPDATE offices SET name = ?, city = ?, address = ? WHERE id = ?',
            [name, city, address, id]
        );
    }

    static async delete(id) {
        await pool.query('DELETE FROM offices WHERE id = ?', [id]);
    }
}

module.exports = Office;