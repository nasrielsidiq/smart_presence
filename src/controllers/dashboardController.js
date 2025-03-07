const attendance = require('../models/attendance.js');
const employee = require('../models/employee.js');

class dashboardController{
    async index(req, res){
        try{
            const employeeCount = await employee.totalEmployee();
            const attendanceCount = await attendance.totalAbcent();
            const onTimeCount = await attendance.totalOnTime();
            const lateCount = await attendance.totalLate();
            res.json({employeeCount, attendanceCount, onTimeCount, lateCount});
        }catch(error){
            res.status(500).json({error: error.message});
        }
    }
}

module.exports = dashboardController;