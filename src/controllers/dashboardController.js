const attendance = require('../models/attendance.js');
const employee = require('../models/employee.js');

class DashboardController {
    /**
     * Handle the index request for the dashboard.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async index(req, res) {
        try {
            const employeeCount = await employee.totalEmployee();
            const attendanceCount = await attendance.totalAbcent();
            const onTimeCount = await attendance.totalOnTime();
            const lateCount = await attendance.totalLate();
            res.json({ employeeCount, attendanceCount, onTimeCount, lateCount });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = DashboardController;