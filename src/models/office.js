const pool = require('../db.js');

class Office {
    /**
     * Create a new office.
     * @param {Object} office - The office data.
     * @param {string} office.name - The name of the office.
     * @param {string} office.city - The city where the office is located.
     * @param {string} office.address - The address of the office.
     * @returns {Promise<number>} - The ID of the created office.
     */
    static async create(office) {
        const { name, city, address, img_office = null } = office;
        const [result] = await pool.query(
            'INSERT INTO offices (name, city, address, img_office) VALUES (?, ?, ?, ?)',
            [name, city, address, img_office]
        );
        return result.insertId;
    }

    /**
     * Retrieve all offices.
     * @returns {Promise<Array>} - An array of office records.
     */
    static async findAll({ page = 1, limit = 10, key = null, city = null }) {
        const offset = (page - 1) * limit;
        let keyFilter = '';
        const keyFilterParams = [];
        if (key) {
            keyFilter = `WHERE name LIKE ? OR city LIKE ? OR address LIKE ?`;
            const keyQuery = `%${key}%`;
            keyFilterParams.push(keyQuery, keyQuery, keyQuery);
        }

        if (city) {   
            keyFilter += ` ${key ? 'AND' : 'WHERE'} city = ?`;
            keyFilterParams.push(city);
        }

        const [rows] = await pool.query(`SELECT * FROM offices ${keyFilter} LIMIT ? OFFSET ?`, [...keyFilterParams ,limit, offset]); 
        const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM offices`, [...keyFilterParams]);
        return {
            offices: rows,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }

    static async getAll() {
        const [rows] = await pool.query('SELECT * FROM offices'); 
        return rows;
    }

    static async getUniqueCities() {
        const [rows] = await pool.query('SELECT DISTINCT city FROM offices');
        return rows.map(row => row.city);
    }
    /**
     * Find an office by ID.
     * @param {number} id - The ID of the office.
     * @returns {Promise<Object|null>} - The office record if found, otherwise null.
     */
    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM offices WHERE id = ?', [id]);
        return rows[0];
    }

    

    /**
     * Update an office by ID.
     * @param {number} id - The ID of the office.
     * @param {Object} office - The updated office data.
     * @param {string} office.name - The name of the office.
     * @param {string} office.city - The city where the office is located.
     * @param {string} office.address - The address of the office.
     * @returns {Promise<boolean>} - A boolean indicating whether the update was successful.
     */
    static async update(id, office) {
        try {
            const { name, city, address, img_office } = office;

            const [rows] = await pool.query('SELECT img_office FROM offices WHERE id = ?', [id]);
            if (rows.length === 0) {
                throw new Error('Office not found');
            }

            let newImage = rows[0].img_office;
            if (img_office) {
                newImage = img_office;
            }

            const [update] = await pool.query(
                'UPDATE offices SET name = ?, city = ?, address = ?, img_office = ? WHERE id = ?',
                [name, city, address, newImage, id]
            );

            return update.affectedRows > 0;
        } catch (error) {
            console.error('Error updating office:', error);
            throw new Error('Failed to update office');
        }
    }

    /**
     * Delete an office by ID.
     * @param {number} id - The ID of the office.
     * @returns {Promise<boolean>} - A boolean indicating whether the deletion was successful.
     */
    static async delete(id) {
        try {
            const [result] = await pool.query('DELETE FROM offices WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting office:', error);
            throw new Error('Failed to delete office');
        }
    }
}

module.exports = Office;