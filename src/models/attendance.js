const pool = require('../db.js');
const Employee = require('./employee.js');

class Attendance {
    /**
     * Create or update an attendance record for an employee.
     * @param {Object} attendance - The attendance data.
     * @param {number} attendance.employee_id - The ID of the employee.
     * @param {string} attendance.time - The time of the attendance.
     * @returns {Promise<number|boolean>} - The ID of the created record or a boolean indicating success for updates.
     */
    static async create(attendance) {
        let { employee_id, time, device_code } = attendance;

        const now = new Date(time.replace(' ', 'T'));
        const hours = now.getHours();
        const minutes = now.getMinutes();

        console.log(`Parsed time: ${now}`);
        console.log(`Hours: ${hours}, Minutes: ${minutes}`);

        const status_check_in = (hours < 8 || (hours === 8 && minutes <= 15)) ? "on_time" : "late";
        console.log(`Status Check-In: ${status_check_in}`);

        // Check if the employee_id already exists for the given day
        const exists = await this.existsForDay(employee_id);

        if (exists) {
            // Update the existing record
            let status_check_out = "";

            if(hours >= 15){
                if (hours < 17) {
                    status_check_out = "early";
                } else if (hours === 17 && minutes <= 15) {
                    status_check_out = "on_time";
                } else {
                    status_check_out = "late";
                }
            }else{
                return false;
            }

            const category = await this.categoryStatus(exists.status_check_in, status_check_out);

            const [result] = await pool.query(
                'UPDATE attendance SET check_out = ?, status_check_out = ?, category = ? WHERE employee_id = ? AND DATE(check_in) = DATE(NOW())',
                [time, status_check_out, category, employee_id]
            );
            return result.affectedRows > 0;
        } else {
            // Create a new record
            const [result] = await pool.query(
                'INSERT INTO attendance (employee_id, device_code, check_in, check_out, status_check_in, status_check_out, category) VALUES (?, ?, ?, null, ?, null, null)',
                [employee_id, device_code, time, status_check_in]
            );
            return result.insertId;
        }
    }

    /**
     * Check if an employee has an attendance record for the current day.
     * @param {number} employee_id - The ID of the employee.
     * @returns {Promise<Object|null>} - The attendance record if it exists, otherwise null.
     */
    static async existsForDay(employee_id) {
        const [rows] = await pool.query(
            'SELECT * FROM attendance WHERE employee_id = ? AND DATE(check_in) = DATE(NOW())',
            [employee_id]
        );
        return rows[0];
    }

    /**
     * Determine the attendance category based on check-in and check-out statuses.
     * @param {string} status_check_in - The check-in status.
     * @param {string} status_check_out - The check-out status.
     * @returns {Promise<string>} - The attendance category.
     */
    static async categoryStatus(status_check_in, status_check_out) {
        if (status_check_in === 'on_time' && status_check_out === 'on_time') {
            return 'discipline';
        } else if (status_check_in === 'late' || status_check_out === 'early') {
            return 'undiscipline';
        } else if (status_check_in === 'on_time' && status_check_out === 'late') {
            return 'overtime';
        }
    }

    /**
     * Retrieve all attendance records.
     * @param {Object} options - The options for retrieving attendance records.
     * @param {number} [options.page=1] - The page number.
     * @param {number} [options.limit=10] - The number of records per page.
     * @param {string} [options.period='daily'] - The period for filtering records (daily, weekly, monthly).
     * @param {number} [options.sp_id=null] - The supervisor ID for filtering records.
     * @returns {Promise<Object>} - An object containing the attendance records, total records, total pages, and current page.
     */
    static async findAll({ page = 1, limit = 10, period = 'daily', division = '', office = '', sp_id = null }) {
        const offset = (page - 1) * limit;
        let dateFilter = '1=2';
        let divisionFilter = '';
        let officeFilter = '';
        // Filter based on the time period
        if (period === 'daily') {
            dateFilter = 'DATE(check_in) = CURDATE()'; // Today
        } else if (period === 'weekly') {
            dateFilter = 'YEARWEEK(check_in, 1) = YEARWEEK(CURDATE(), 1)'; // This week
        } else if (period === 'monthly') {
            dateFilter = 'MONTH(check_in) = MONTH(CURDATE()) AND YEAR(check_in) = YEAR(CURDATE())'; // This month
        }

        if(division){
            divisionFilter = `AND d.id = ${division}`;
        }

        if(office){
            officeFilter = `AND o.id = ${office}`;
        }

        let [rows] = [];
        let total = 0;

        if (sp_id) {
            [rows] = await pool.query(`
                SELECT 
                    a.id, a.employee_id, e.full_name, a.check_in, a.check_out, 
                    a.status_check_in, a.status_check_out, a.category, 
                    e.office_id, e.serial_id, e.position, 
                    d.name AS division_name, o.name AS office_name 
                FROM attendance a 
                INNER JOIN employees e ON a.employee_id = e.id 
                INNER JOIN divisions d ON e.division_id = d.id 
                INNER JOIN offices o ON e.office_id = o.id 
                WHERE ${dateFilter} AND e.supervisor_id = ? 
                ${divisionFilter} ${officeFilter} 
                LIMIT ? OFFSET ?
            `, [sp_id, limit, offset]);
        
            [[{ total }]] = await pool.query(`
                SELECT COUNT(*) AS total 
                FROM attendance a 
                INNER JOIN employees e ON a.employee_id = e.id 
                INNER JOIN divisions d ON e.division_id = d.id 
                INNER JOIN offices o ON e.office_id = o.id 
                WHERE ${dateFilter} AND e.supervisor_id = ? 
                ${divisionFilter} ${officeFilter}
            `, [sp_id]);
        } else {
            [rows] = await pool.query(`
                SELECT 
                    a.id, a.employee_id, e.full_name, a.check_in, a.check_out, 
                    a.status_check_in, a.status_check_out, a.category, 
                    e.office_id, e.serial_id, e.position, 
                    d.name AS division_name, o.name AS office_name 
                FROM attendance a 
                INNER JOIN employees e ON a.employee_id = e.id 
                INNER JOIN divisions d ON e.division_id = d.id 
                INNER JOIN offices o ON e.office_id = o.id 
                WHERE ${dateFilter} 
                ${divisionFilter} ${officeFilter} 
                LIMIT ? OFFSET ?
            `, [limit, offset]);
        
            [[{ total }]] = await pool.query(`
                SELECT COUNT(*) AS total 
                FROM attendance a 
                INNER JOIN employees e ON a.employee_id = e.id 
                INNER JOIN divisions d ON e.division_id = d.id 
                INNER JOIN offices o ON e.office_id = o.id 
                WHERE ${dateFilter} 
                ${divisionFilter} ${officeFilter}
            `);
        }
        

        return {
            attendance: rows,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }

    /**
     * Retrieve individual attendance records for a specific employee.
     * @param {Object} options - The options for retrieving attendance records.
     * @param {number} [options.page=1] - The page number.
     * @param {number} [options.limit=10] - The number of records per page.
     * @param {string} [options.period='daily'] - The period for filtering records (daily, weekly, monthly).
     * @param {number} options.employee_id - The ID of the employee.
     * @returns {Promise<Object>} - An object containing the attendance records, total records, total pages, and current page.
     */
    static async IndividuAttendanceAll({ page = 1, limit = 10, period = 'daily', employee_id }) {
        const offset = (page - 1) * limit;
        let dateFilter = '1=2';
        // Filter based on the time period
        if (period === 'daily') {
            dateFilter = 'DATE(check_in) = CURDATE()'; // Today
        } else if (period === 'weekly') {
            dateFilter = 'YEARWEEK(check_in, 1) = YEARWEEK(CURDATE(), 1)'; // This week
        } else if (period === 'monthly') {
            dateFilter = 'MONTH(check_in) = MONTH(CURDATE()) AND YEAR(check_in) = YEAR(CURDATE())'; // This month
        }
        const [rows] = await pool.query(`SELECT a.id, a.employee_id, e.full_name, a.check_in, a.check_out, a.status_check_in, a.status_check_out, a.category, e.office_id, e.serial_id, e.position, d.name AS division_name, o.name AS office_name FROM attendance a INNER JOIN employees e ON a.employee_id = e.id INNER JOIN divisions d ON e.division_id = d.id INNER JOIN offices o ON e.office_id = o.id WHERE a.employee_id = ? AND ${dateFilter} LIMIT ? OFFSET ?`, [employee_id, limit, offset]);
        const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM attendance a INNER JOIN employees e ON a.employee_id = e.id INNER JOIN divisions d ON e.division_id = d.id INNER JOIN offices o ON e.office_id = o.id WHERE a.employee_id = ? AND ${dateFilter} LIMIT ? OFFSET ?`, [employee_id, limit, offset]);
        return {
            attendance: rows,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }

    /**
     * Get the total number of on-time attendance records.
     * @returns {Promise<number>} - The total number of on-time attendance records.
     */
    static async totalOnTime() {
        const [rows] = await pool.query('SELECT COUNT(*) as total FROM attendance WHERE status_check_in = "on_time" AND status_check_out = "on_time"');
        return rows[0].total;
    }

    /**
     * Get the total number of late attendance records.
     * @returns {Promise<number>} - The total number of late attendance records.
     */
    static async totalLate() {
        const [rows] = await pool.query('SELECT COUNT(*) as total FROM attendance WHERE status_check_in = "late" OR status_check_out = "late"');
        return rows[0].total;
    }

    /**
     * Get the total number of attendance records.
     * @returns {Promise<number>} - The total number of attendance records.
     */
    static async totalAbsent() {
        const [[{ absent_today }]] = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM employees) - 
                (SELECT COUNT(DISTINCT employee_id) FROM attendance WHERE DATE(check_in) = CURDATE()) 
            AS absent_today
        `);
        return absent_today;
    }

    /**
     * Get the employee ranking based on attendance.
     * @param {Object} options - The options for retrieving employee ranking.
     * @param {number} [options.spId=null] - The supervisor ID for filtering records.
     * @returns {Promise<Array>} - An array of employee ranking records.
     */
    static async getEmployeeRanking({ spId = null }) {
        try {
            let query = `
                SELECT 
                    e.id AS employee_id,
                    e.full_name AS employee_name,
                    COUNT(a.id) AS total_attendance,
                    SUM(
                        CASE 
                            WHEN a.category = 'discipline' THEN 2
                            WHEN a.category = 'overtime' THEN 1
                            ELSE 0 
                        END
                    ) AS total_score,
                    ds.current_streak AS current_streak 
                FROM employees e
                LEFT JOIN attendance a ON e.id = a.employee_id
                LEFT JOIN discipline_streaks ds ON e.id = ds.employee_id
            `;
            
    
            let params = [];
    
            if (spId) {
                query += ` WHERE e.supervisor_id = ?`;
                params.push(spId);
            }
    
            query += ` GROUP BY e.id, e.full_name ORDER BY current_streak DESC, total_score DESC, total_attendance DESC`;
    
            const [rows] = await pool.query(query, params);
            console.log("Query Result:", rows); // Debugging
            return rows;
        } catch (error) {
            console.error("Error fetching employee ranking:", error);
            throw error; 
        }
    }

    /**
     * Get the attendance statistics per month.
     * @returns {Promise<Array>} - An array of attendance statistics per month.
     */
    static async grafikPerBulan() {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    MONTH(check_in) AS month,
                    d.id AS division_id,
                    d.name AS division_name,
                    COUNT(CASE WHEN category = "discipline" THEN 1 END) AS disciplineChart,
                    COUNT(CASE WHEN category = "undiscipline" THEN 1 END) AS undisciplineChart
                FROM attendance a
                INNER JOIN employees e ON a.employee_id = e.id
                INNER JOIN divisions d ON e.division_id = d.id
                WHERE YEAR(a.check_in) = YEAR(CURDATE())
                GROUP BY d.id, MONTH(a.check_in)
                ORDER BY d.id, MONTH(a.check_in)
            `);
            return rows;
        } catch (error) {
            console.error('Error fetching attendance per month:', error);
            throw error;
        }
    }


    static async IndividuAttendanceAllTest({ page = 1, limit = 10}) {
        const offset = (page - 1) * limit;

        const [rows] = await pool.query(`
            SELECT e.id AS employee_id, e.full_name, a.check_in, a.status_check_in, d.name as division_name, o.name 
            FROM employees e 
            INNER JOIN divisions d ON e.division_id = d.id
            INNER JOIN offices o ON e.office_id = o.id
            LEFT JOIN attendance a ON a.employee_id = e.id 
                AND DATE(a.check_in) = CURDATE() 
            LIMIT ? OFFSET ?
        `, [limit, offset]);

        const [[{ total }]] = await pool.query(`
            SELECT COUNT(*) as total
            FROM employees e 
            INNER JOIN divisions d ON e.division_id = d.id
            INNER JOIN offices o ON e.office_id = o.id
            LEFT JOIN attendance a ON a.employee_id = e.id 
                AND DATE(a.check_in) = CURDATE() 
            LIMIT ? OFFSET ?
        `, [limit, offset]);
        
        // const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM attendance a INNER JOIN employees e ON a.employee_id = e.id INNER JOIN divisions d ON e.division_id = d.id INNER JOIN offices o ON e.office_id = o.id WHERE a.employee_id = ? AND ${dateFilter} LIMIT ? OFFSET ?`, [employee_id, limit, offset]);
        return {
            attendance: rows,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }
}

module.exports = Attendance;