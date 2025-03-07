const pool = require('../db.js');

class Attendance {
    static async create(attendance) {
        const { employee_id } = attendance;

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        const status_check_in = (hours < 8 || (hours === 8 && minutes <= 15)) ? "on_time" : "late";


        // Check if the employee_id already exists for the given day
        const exists = await this.existsForDay(employee_id);

        if (exists) {
            // Update the existing record

            let status_check_out = "";

            if(hours < 17 ){
                status_check_out = "early";
            }else if(hours > 17 || (hours === 17 && minutes <= 15)){
                status_check_out = "on_time";
            }else{
                status_check_out = "late";
            }

            const category = await this.categoryStatus(exists.status_check_in, status_check_out);

            const [result] = await pool.query(
                'UPDATE attendance SET check_out = NOW(), status_check_out = ?, category = ? WHERE employee_id = ? AND DATE(check_in) = DATE(NOW())',
                [status_check_out, category, employee_id]
            );
            return result.affectedRows > 0;
        } else {
            // Create a new record
            const [result] = await pool.query(
                'INSERT INTO attendance (employee_id, check_in, check_out, status_check_in, status_check_out, category) VALUES (?, NOW(), null, ?, null, null)',
                [employee_id, status_check_in]
            );
            return result.insertId;
        }
    }

    static async existsForDay(employee_id) {
        const [rows] = await pool.query(
            'SELECT * FROM attendance WHERE employee_id = ? AND DATE(check_in) = DATE(NOW())',
            [employee_id]
        );
        return rows[0];
    }

    static async categoryStatus(status_check_in, status_check_out) {
        if(status_check_in === 'on_time' && status_check_out === 'on_time'){
            return 'discipline';
        }else if(status_check_in === 'late' || status_check_out === 'early'){
            return 'undiscipline';
        }else if(status_check_in === 'on' && status_check_out === 'late'){
            return 'overtime';
        }
    }

    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM attendance');
        return rows;
    }


    static async totalOnTime() {    
        const [rows] = await pool.query('SELECT COUNT(*) as total FROM attendance WHERE status_check_in = "on_time" AND status_check_out = "on_time"');
        return rows[0].total;
    }

    static async totalLate() {
        const [rows] = await pool.query('SELECT COUNT(*) as total FROM attendance WHERE status_check_in = "late" OR status_check_out = "late"');
        return rows[0].total;
    }

    // static async totalOnLeave() {
    //     const [rows] = await pool.query('SELECT COUNT(*) as total FROM attendance WHERE status_check_in = "on_leave" OR status_check_out = "on_leave"');
    //     return rows[0].total;
    // }

    static async totalAbcent() {
        const [rows] = await pool.query('SELECT COUNT(*) as total FROM attendance');
        return rows[0].total;
    }
}

module.exports = Attendance;