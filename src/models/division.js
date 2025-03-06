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
        try{
            const { office_id, name } = division;
            const [update] = await pool.query(
                'UPDATE divisions SET office_id = ?, name = ? WHERE id = ?',
                [office_id, name, id]
            );
            return update.affectedRows > 0;
        }catch(error){
            console.error('Error updating division:', error);
            throw new Error('Failed to update division');
        }
    }

    static async delete(id) {
        try{
            const [result] = await pool.query('DELETE FROM divisions WHERE id = ?', [id]);
            console.log(result.affectedRows > 0);
            return result.affectedRows > 0;
        }catch(error){
            console.error('Error deleting division:', error);
            throw new Error('Failed to delete division');
        }
    }
}

module.exports = Division;