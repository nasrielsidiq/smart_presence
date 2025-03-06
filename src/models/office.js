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
        try{
            const { name, city, address } = office;
            const [update] = await pool.query(
                'UPDATE offices SET name = ?, city = ?, address = ? WHERE id = ?',
                [name, city, address, id]
            );

            return update.affectedRows > 0;
        }catch(error){
            console.error('Error updating office:', error);
            throw new Error('Failed to update office');
        }
    }

    static async delete(id) {
        try{
            const [result] = await pool.query('DELETE FROM offices WHERE id = ?', [id]);
            return result.affectedRows > 0;
        }catch(error){
            console.error('Error deleting office:', error);
            throw new Error('Failed to delete office');
    }
    }
}

module.exports = Office;