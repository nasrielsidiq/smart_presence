const User = require('../models/user');
const Office = require('../models/office');
const Attendance = require('../models/attendance');
const Employee = require('../models/employee');
const { format } = require('fast-csv');

class csvController {
    async csvDownloadAll(req, res) {
        const period = req.query.period || 'all';
        const division = req.query.division || null;
        const office = req.query.office || null;

        const data = await Attendance.findAll({period : period, division : division, office : office, limit : 10000000000});        
    
        // Set header supaya browser tahu ini file CSV
        res.setHeader("Content-Disposition", "attachment; filename=data.csv");
        res.setHeader("Content-Type", "text/csv");
    
        // Stream data CSV ke response
        const csvStream = format({ headers: true });
        csvStream.pipe(res);
        data.attendance.forEach(row => csvStream.write(row));
        csvStream.end();
    }
    async csvDownloadIndividu(req, res) {
        const period = req.query.period || 'all';
        const employee_id = req.params.id;
        const employee = await Employee.findById(employee_id);
        console.log(employee_id);
        if(!employee) return res.status(404).json({message : 'Employee not found'});
        
        const data = await Attendance.IndividuAttendanceAll({employee_id : employee_id, limit : 10000000000, period : period});
        if(!data) return res.status(404).json({message : 'Data not found'});        
    
        // Set header supaya browser tahu ini file CSV
        res.setHeader("Content-Disposition", "attachment; filename=data.csv");
        res.setHeader("Content-Type", "text/csv");
    
        // Stream data CSV ke response
        const csvStream = format({ headers: true });
        csvStream.pipe(res);
        data.attendance.forEach(row => csvStream.write(row));
        csvStream.end();
    }
}
module.exports = csvController;